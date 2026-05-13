"""
datadog_monitor.py
------------------
Sends custom metrics to Datadog using DogStatsD.
Import send_metric() anywhere in the app to track
custom events like predictions, errors, and response times.
"""

import os
import time
import logging
from functools import wraps
from flask import request, g

logger = logging.getLogger(__name__)

# Try to import datadog — gracefully skip if not installed
try:
    from datadog import initialize, statsd
    DD_AVAILABLE = True
    initialize(
        statsd_host=os.getenv("DD_AGENT_HOST", "localhost"),
        statsd_port=int(os.getenv("DD_DOGSTATSD_PORT", 8125))
    )
    logger.info("Datadog StatsD initialised.")
except ImportError:
    DD_AVAILABLE = False
    logger.warning("datadog package not installed. Metrics disabled.")


def send_metric(metric_name: str, value: float = 1,
                tags: list = None, metric_type: str = "increment"):
    """
    Send a custom metric to Datadog.

    metric_type options:
        increment — count events (default)
        gauge     — track a value at a point in time
        histogram — track distribution of values
        timing    — track duration in ms
    """
    if not DD_AVAILABLE:
        return

    tags = tags or []
    tags.append(f"env:{os.getenv('DD_ENV','development')}")
    tags.append(f"service:{os.getenv('DD_SERVICE','flask-backend')}")

    try:
        if metric_type == "increment":
            statsd.increment(metric_name, tags=tags)
        elif metric_type == "gauge":
            statsd.gauge(metric_name, value, tags=tags)
        elif metric_type == "histogram":
            statsd.histogram(metric_name, value, tags=tags)
        elif metric_type == "timing":
            statsd.timing(metric_name, value, tags=tags)
    except Exception as e:
        logger.warning(f"Failed to send metric {metric_name}: {e}")


def track_prediction(disease: str, confidence: float, severity: str):
    """Track a completed ML prediction."""
    send_metric("symptom_checker.predictions.total",
                tags=[f"disease:{disease}", f"severity:{severity}"])
    send_metric("symptom_checker.predictions.confidence",
                value=confidence * 100,
                metric_type="gauge",
                tags=[f"disease:{disease}"])
    logger.info(f"Tracked prediction metric: {disease} ({confidence:.2f})")


def track_user_registration():
    """Track a new user registration."""
    send_metric("symptom_checker.users.registered")


def track_login():
    """Track a user login."""
    send_metric("symptom_checker.users.logins")


def track_error(error_type: str, endpoint: str):
    """Track an application error."""
    send_metric("symptom_checker.errors.total",
                tags=[f"error:{error_type}", f"endpoint:{endpoint}"])


def request_timer(f):
    """
    Decorator that measures how long a Flask route takes
    and sends the duration to Datadog.

    Usage:
        @app.route("/api/symptoms", methods=["POST"])
        @require_auth
        @request_timer
        def check_symptoms():
            ...
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        start = time.time()
        try:
            response = f(*args, **kwargs)
            duration = (time.time() - start) * 1000
            send_metric(
                "symptom_checker.request.duration",
                value=duration,
                metric_type="timing",
                tags=[
                    f"endpoint:{request.endpoint}",
                    f"method:{request.method}",
                    f"status:success"
                ]
            )
            return response
        except Exception as e:
            duration = (time.time() - start) * 1000
            send_metric(
                "symptom_checker.request.duration",
                value=duration,
                metric_type="timing",
                tags=[
                    f"endpoint:{request.endpoint}",
                    f"method:{request.method}",
                    f"status:error"
                ]
            )
            raise e
    return decorated