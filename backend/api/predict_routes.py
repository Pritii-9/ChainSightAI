import random
from flask import Blueprint, jsonify, request
from core.errors import APIError

predict_bp = Blueprint("predict", __name__)

@predict_bp.route("/predict/delay", methods=["POST"])
def predict_delay():
    try:
        data = request.get_json(force=True)
        origin = data.get("origin", "")
        destination = data.get("destination", "")
        carrier = data.get("carrier", "")
        
        # Simple heuristic + random noise for the demo "ML" model
        risk_score = random.uniform(0.1, 0.4)
        
        if "Kaohsiung" in origin or "Taiwan" in origin or "Shanghai" in origin:
            risk_score += 0.35  # Weather/Congestion penalty
        if "Long Beach" in destination or "Los Angeles" in destination:
            risk_score += 0.20  # Port congestion penalty
        if carrier == "MSC":
            risk_score -= 0.10
            
        risk_score = max(0.01, min(0.99, risk_score))
        
        factors = []
        if risk_score > 0.6:
            factors = [
                {"factor": "Weather Anomaly / High Seas", "impact": "+35%"},
                {"factor": "Port Congestion (Destination)", "impact": "+20%"}
            ]
        elif risk_score > 0.3:
            factors = [
                {"factor": "Seasonal Volume Spikes", "impact": "+15%"},
                {"factor": "Historical Carrier Variance", "impact": "+10%"}
            ]
        else:
            factors = [
                {"factor": "Optimal Routing", "impact": "-15%"},
                {"factor": "Clear Weather Corridor", "impact": "-5%"}
            ]
            
        return jsonify({
            "risk_score": round(risk_score * 100, 1),
            "prediction": "High Risk" if risk_score > 0.6 else "Medium Risk" if risk_score > 0.3 else "Low Risk",
            "top_factors": factors,
            "model_version": "v1.2.4-rf"
        })
    except Exception as e:
        raise APIError(str(e), status_code=400)
