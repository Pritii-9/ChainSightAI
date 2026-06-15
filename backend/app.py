import logging
import os
from flask import Flask
from flask_cors import CORS

from api.routes import api_bp
from core.errors import register_error_handlers

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
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

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
