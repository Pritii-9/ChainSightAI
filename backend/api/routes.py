import logging
from flask import Blueprint, jsonify, request
from pydantic import ValidationError

from core.errors import APIError
from models.schemas import CopilotRequest, ShipmentUpdateWebhook
from services.copilot_service import run_copilot

try:
    from services.agent_tools import run_agent
    from services.rag_engine import setup_collection, query_shipments
    _HAS_RAG = True
    collection = setup_collection()
except ImportError:
    _HAS_RAG = False

logger = logging.getLogger(__name__)

api_bp = Blueprint('api', __name__)

import os

@api_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok", 
        "rag_available": _HAS_RAG,
        "demo_mode": not bool(os.environ.get("GROQ_API_KEY"))
    })

@api_bp.route("/copilot", methods=["POST"])
def copilot_route():
    try:
        payload = request.get_json(force=True)
        validated_data = CopilotRequest(**payload)
    except ValidationError as e:
        raise APIError("Invalid payload format", status_code=400, payload={"details": e.errors()})
    except Exception:
        raise APIError("Invalid JSON payload", status_code=400)
        
    try:
        result = run_copilot(validated_data.query)
        return jsonify(result)
    except Exception as exc:
        logger.exception("Error in /copilot endpoint")
        raise APIError("Copilot service unavailable", status_code=503, payload={"details": str(exc)})

@api_bp.route("/query", methods=["POST"])
def query_route():
    if not _HAS_RAG:
        raise APIError("RAG engine not available — missing dependencies", status_code=503)
    try:
        payload = request.get_json(force=True)
        validated_data = CopilotRequest(**payload)
    except ValidationError as e:
        raise APIError("Invalid payload format", status_code=400, payload={"details": e.errors()})
        
    try:
        results = query_shipments(collection, validated_data.query)
        return jsonify({"results": results})
    except Exception as exc:
        logger.exception("Error in /query endpoint")
        raise APIError("Internal server error", status_code=500, payload={"details": str(exc)})

@api_bp.route("/ask", methods=["POST"])
def ask_route():
    if not _HAS_RAG:
        raise APIError("Agent not available — missing dependencies", status_code=503)
    try:
        payload = request.get_json(force=True)
        validated_data = CopilotRequest(**payload)
    except ValidationError as e:
        raise APIError("Invalid payload format", status_code=400, payload={"details": e.errors()})
        
    try:
        agent_result = run_agent(validated_data.query)
        return jsonify(agent_result)
    except Exception as exc:
        logger.exception("Error in /ask endpoint")
        raise APIError("Agent service unavailable", status_code=503, payload={"details": str(exc)})

@api_bp.route("/webhook/shipment_update", methods=["POST"])
def shipment_update_webhook():
    try:
        payload = request.get_json(force=True)
        validated_data = ShipmentUpdateWebhook(**payload)
    except ValidationError as e:
        raise APIError("Invalid payload format", status_code=400, payload={"details": e.errors()})
        
    try:
        analysis_query = (
            f"Analyze the impact of shipment update for order {validated_data.order_id}. "
            f"Status: {validated_data.status}. Reason: {validated_data.reason}."
        )
        copilot_result = run_copilot(analysis_query)

        logger.info(
            "Shipment webhook received: order_id=%s status=%s reason=%s",
            validated_data.order_id, validated_data.status, validated_data.reason,
        )

        return jsonify({
            "order_id": validated_data.order_id,
            "status": validated_data.status,
            "reason": validated_data.reason,
            "agent_result": copilot_result,
        })
    except Exception as exc:
        logger.exception("Error in /webhook/shipment_update endpoint")
        raise APIError("Webhook processing failed", status_code=503, payload={"details": str(exc)})
