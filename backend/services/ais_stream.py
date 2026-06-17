import json
import os
import threading
import time
import logging
import websocket
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

AISSTREAM_API_KEY = os.getenv("AISSTREAM_API_KEY")

class AISStreamClient:
    def __init__(self, socketio):
        self.socketio = socketio
        self.ws = None
        self.thread = None
        self.running = False
        self.last_emit_time = 0

    def start(self):
        if not AISSTREAM_API_KEY:
            logger.warning("No AISSTREAM_API_KEY found. Live AIS tracking disabled.")
            return

        self.running = True
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def stop(self):
        self.running = False
        if self.ws:
            self.ws.close()

    def _on_message(self, ws, message):
        try:
            # Rate limit to avoid choking the frontend (max 2 emissions per second)
            now = time.time()
            if now - self.last_emit_time < 0.5:
                return

            data = json.loads(message)
            if data.get("MessageType") == "PositionReport":
                msg = data["Message"]["PositionReport"]
                meta = data.get("MetaData", {})
                
                payload = {
                    "mmsi": meta.get("MMSI"),
                    "name": meta.get("ShipName", "Unknown Ship").strip(),
                    "lat": msg.get("Latitude"),
                    "lng": msg.get("Longitude"),
                    "cog": msg.get("Cog"), # Course over ground
                    "sog": msg.get("Sog"), # Speed over ground
                    "timestamp": meta.get("time_utc")
                }
                
                # Only broadcast valid coordinates
                if payload["lat"] and payload["lng"] and payload["lat"] != 91.0 and payload["lng"] != 181.0:
                    self.socketio.emit("ais_position", payload)
                    self.last_emit_time = now

        except Exception as e:
            logger.error(f"AISStream parsing error: {e}")

    def _on_error(self, ws, error):
        logger.error(f"AISStream error: {error}")

    def _on_close(self, ws, close_status_code, close_msg):
        logger.info("AISStream connection closed")

    def _on_open(self, ws):
        logger.info("AISStream connection opened. Subscribing to major trade routes...")
        # Subscribe to bounding boxes covering major oceans/ports to get relevant cargo ships
        sub_msg = {
            "APIKey": AISSTREAM_API_KEY,
            "BoundingBoxes": [
                [[-90, -180], [90, 180]] # Global bounding box
            ],
            "FilterMessageTypes": ["PositionReport"]
        }
        ws.send(json.dumps(sub_msg))

    def _run(self):
        while self.running:
            try:
                websocket.enableTrace(False)
                self.ws = websocket.WebSocketApp(
                    "wss://stream.aisstream.io/v0/stream",
                    on_open=self._on_open,
                    on_message=self._on_message,
                    on_error=self._on_error,
                    on_close=self._on_close,
                )
                self.ws.run_forever()
            except Exception as e:
                logger.error(f"AISStream websocket exception: {e}")
            
            if self.running:
                logger.info("Reconnecting to AISStream in 5 seconds...")
                time.sleep(5)

def start_ais_stream(socketio):
    client = AISStreamClient(socketio)
    client.start()
    return client
