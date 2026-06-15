"""Lightweight backend — only the /copilot endpoint, no heavy ML dependencies."""
import logging
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

from services.copilot_service import run_copilot

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "mode": "copilot-only"})


@app.route("/copilot", methods=["POST"])
def copilot_route():
    try:
        payload = request.get_json(force=True)
        user_query = payload.get("query", "")
        if not user_query:
            return jsonify({"error": "Missing query text"}), 400
        result = run_copilot(user_query)
        return jsonify(result)
    except Exception as exc:
        logger.exception("Error in /copilot endpoint")
        return jsonify({"error": "Copilot service unavailable", "details": str(exc)}), 503


@app.route("/webhook/shipment_update", methods=["POST"])
def shipment_update_webhook():
    try:
        payload = request.get_json(force=True)
        order_id = payload.get("order_id")
        status = payload.get("status")
        reason = payload.get("reason")
        if not order_id or not status or not reason:
            return jsonify({"error": "order_id, status, and reason are required"}), 400
        analysis_query = (
            f"Analyze the impact of shipment update for order {order_id}. "
            f"Status: {status}. Reason: {reason}."
        )
        result = run_copilot(analysis_query)
        return jsonify({"order_id": order_id, "status": status, "reason": reason, "agent_result": result})
    except Exception as exc:
        logger.exception("Error in /webhook/shipment_update endpoint")
        return jsonify({"error": "Webhook processing failed", "details": str(exc)}), 503


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
