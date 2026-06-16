import time
import random
import threading
import logging

logger = logging.getLogger(__name__)

# Real-world anomaly scenarios
SCENARIOS = [
    {
        "shipment_id": "SO-4523",
        "type": "WEATHER_ALERT",
        "message": "Typhoon Mawar intensifying near Kaohsiung port. Sustained winds at 85mph.",
        "status_change": "At Risk",
        "severity": "high"
    },
    {
        "shipment_id": "SO-4521",
        "type": "PORT_CONGESTION",
        "message": "CBP customs hold at Port of Long Beach — HS code documentation discrepancy flagged.",
        "status_change": "Delayed",
        "severity": "critical"
    },
    {
        "shipment_id": "SO-4522",
        "type": "CARRIER_UPDATE",
        "message": "MSC Carrier route optimization complete. ETA improved by 14 hours.",
        "status_change": "On Schedule",
        "severity": "low"
    }
]

def background_telemetry_loop(socketio, app):
    """
    Simulates incoming IoT telemetry and external API webhooks (like weather or port authorities).
    Runs as a background thread.
    """
    with app.app_context():
        logger.info("Real-time telemetry simulator started.")
        # Wait 10 seconds before firing the first alert so the user has time to load the page
        time.sleep(10)

        while True:
            # Pick a random scenario to broadcast
            scenario = random.choice(SCENARIOS)
            logger.info(f"Broadcasting telemetry event: {scenario['type']} for {scenario['shipment_id']}")
            
            socketio.emit('telemetry_update', scenario)
            
            # Wait 30 to 45 seconds before the next real-world anomaly
            time.sleep(random.randint(30, 45))

def start_simulator(socketio, app):
    thread = threading.Thread(target=background_telemetry_loop, args=(socketio, app))
    thread.daemon = True
    thread.start()
