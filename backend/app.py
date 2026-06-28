import logging
import os
import sys

# Mask eventlet on Python 3.13+ before importing socketio to prevent auto-import crash
async_mode = None
if sys.version_info >= (3, 13):
    sys.modules['eventlet'] = None
    async_mode = "threading"
else:
    try:
        import eventlet
        eventlet.monkey_patch()
        async_mode = "eventlet"
    except ImportError:
        async_mode = "threading"

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO

from api.routes import api_bp
from core.errors import register_error_handlers

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

socketio = SocketIO()

def create_app():
    app = Flask(__name__)
    
    socketio.init_app(
        app,
        cors_allowed_origins=[
            r"https://.*\.vercel\.app",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
            "http://localhost:4174",
            "http://127.0.0.1:4174",
        ],
        async_mode=async_mode
    )

    CORS(
        app,
        origins=[
            r"https://.*\.vercel\.app",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:4173",
            "http://127.0.0.1:4173",
            "http://localhost:4174",
            "http://127.0.0.1:4174",
        ],
        supports_credentials=True,
    )

    register_error_handlers(app)
    app.register_blueprint(api_bp)

    from api.analytics_routes import analytics_bp
    app.register_blueprint(analytics_bp)

    from api.predict_routes import predict_bp
    app.register_blueprint(predict_bp)

    from api.incident_routes import incident_bp
    app.register_blueprint(incident_bp)

    from api.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    from api.shipment_routes import shipments_bp
    app.register_blueprint(shipments_bp)
    
    from api.db import init_db
    # Initialize SQLite DB
    init_db()

    from services.simulator import start_simulator
    start_simulator(socketio, app)

    from services.ais_stream import start_ais_stream
    start_ais_stream(socketio)

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    logger.info(f"Starting server on port {port} with {async_mode}...")
    socketio.run(app, host="0.0.0.0", port=port)
