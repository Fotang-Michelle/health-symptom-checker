"""
logger.py
---------
Central logging configuration for the entire Flask app.
Import get_logger() in any module to get a named logger.
"""

import logging
import os
from datetime import datetime

LOG_LEVEL = os.getenv("LOG_LEVEL", "DEBUG")
LOG_DIR   = os.path.join(os.path.dirname(__file__), "..", "logs")

def setup_logging():
    """
    Configure logging for the entire application.
    Logs to both the console and a rotating log file.
    Called once from create_app().
    """
    os.makedirs(LOG_DIR, exist_ok=True)

    log_filename = os.path.join(
        LOG_DIR,
        f"app_{datetime.now().strftime('%Y-%m-%d')}.log"
    )

    # Root logger format
    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console handler — shows logs in terminal
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)

    # File handler — writes logs to disk
    file_handler = logging.FileHandler(log_filename, encoding="utf-8")
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)

    # Apply to root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, LOG_LEVEL, logging.DEBUG))
    root_logger.handlers.clear()
    root_logger.addHandler(console_handler)
    root_logger.addHandler(file_handler)

    logging.getLogger("werkzeug").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)

    logging.info(f"Logging initialised. Level: {LOG_LEVEL}. File: {log_filename}")


def get_logger(name: str) -> logging.Logger:
    """Return a named logger for a module."""
    return logging.getLogger(name)