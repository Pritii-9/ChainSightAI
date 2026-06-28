from flask import Blueprint, jsonify, request
from api.db import get_db
from core.errors import APIError

shipments_bp = Blueprint("shipments", __name__)

@shipments_bp.route("/shipments", methods=["GET"])
def get_shipments():
    conn = get_db()
    rows = conn.execute("SELECT * FROM shipments").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])

@shipments_bp.route("/shipments", methods=["POST"])
def create_shipment():
    data = request.get_json(force=True)
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO shipments (id, origin, destination, status, eta, carrier, sla) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (data['id'], data['origin'], data['destination'], data.get('status', 'On Schedule'), data['eta'], data['carrier'], data['sla'])
        )
        conn.commit()
    except Exception as e:
        conn.close()
        raise APIError(f"Database error: {str(e)}", status_code=500)
    conn.close()
    return jsonify({"message": "Shipment created", "id": data["id"]}), 201

@shipments_bp.route("/shipments/<shipment_id>", methods=["DELETE"])
def delete_shipment(shipment_id):
    conn = get_db()
    conn.execute("DELETE FROM shipments WHERE id = ?", (shipment_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Deleted successfully"})
