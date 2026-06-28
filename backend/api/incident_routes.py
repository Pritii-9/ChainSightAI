import uuid
from flask import Blueprint, jsonify, request
from core.errors import APIError
from datetime import datetime

incident_bp = Blueprint("incidents", __name__)

# In-memory store for demo purposes (acts like a DB for the session)
INCIDENTS = [
    { "id": 'INC-0091', "title": 'SLA Breach - Toyota TMMK',          "severity": 'Critical', "sla": '$18,500', "time": '6m ago',  "shipment": 'SO-4521', "status": "Open", "notes": [] },
    { "id": 'INC-0090', "title": 'Weather Risk - South China Sea',     "severity": 'Warning',  "sla": '$6,200',  "time": '1h ago',  "shipment": 'SO-4523', "status": "Open", "notes": [] },
    { "id": 'INC-0089', "title": 'CBP Documentation Hold',             "severity": 'Critical', "sla": '$9,800',  "time": '3h ago',  "shipment": 'SO-4519', "status": "Investigating", "notes": ["Requested documents from client."] },
    { "id": 'INC-0088', "title": 'Carrier Capacity Constraint',        "severity": 'Info',     "sla": 'Nominal', "time": '5h ago',  "shipment": 'SO-4517', "status": "Resolved", "notes": ["Rebooked on alternative carrier."] },
]

@incident_bp.route("/incidents", methods=["GET"])
def get_incidents():
    return jsonify(INCIDENTS)

@incident_bp.route("/incidents/<incident_id>/status", methods=["PATCH"])
def update_incident_status(incident_id):
    data = request.get_json()
    new_status = data.get("status")
    
    if not new_status:
        raise APIError("Status is required", status_code=400)
        
    for inc in INCIDENTS:
        if inc["id"] == incident_id:
            inc["status"] = new_status
            return jsonify(inc)
            
    raise APIError("Incident not found", status_code=404)
    
@incident_bp.route("/incidents/<incident_id>/notes", methods=["POST"])
def add_incident_note(incident_id):
    data = request.get_json()
    note = data.get("note")
    
    if not note:
        raise APIError("Note text is required", status_code=400)
        
    for inc in INCIDENTS:
        if inc["id"] == incident_id:
            inc["notes"].append({
                "text": note,
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "author": "Current User"
            })
            return jsonify(inc)
            
    raise APIError("Incident not found", status_code=404)
