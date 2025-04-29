"""Bird Spotter package initializer."""
import flask
import os
from flask import Flask, request
import logging

# app is a single object used by all the code modules in this package
app = Flask(__name__)  # pylint: disable=invalid-name

# 设置日志记录
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.before_request
def log_request_info():
    if request.path.startswith('/api/'):
        logger.info("API Request Path: %s", request.path)
        if request.method == 'POST':
            if 'user_id' in request.form:
                logger.info("User ID in form data: %s", request.form.get('user_id'))
            elif request.is_json and 'user_id' in request.json:
                logger.info("User ID in JSON: %s", request.json.get('user_id'))

# Read settings from config module (insta485/config.py)
app.config.from_object('bird_spotter.config')

# Overlay settings read from a Python file whose path is set in the environment
# variable BIRD_SPOTTER_SETTINGS. Setting this environment variable is optional.
# Docs: http://flask.pocoo.org/docs/latest/config/
#
# EXAMPLE:
# $ export BIRD_SPOTTER=secret_key_config.py
app.config.from_envvar('BIRD_SPOTTER_SETTINGS', silent=True)

# Configure upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), "var", "uploads")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["ALLOWED_EXTENSIONS"] = [".jpg", ".jpeg", ".png", ".gif"]

# Tell our app about views and model.  This is dangerously close to a
# circular import, which is naughty, but Flask was designed that way.
# (Reference http://flask.pocoo.org/docs/patterns/packages/)  We're
# going to tell pylint and pycodestyle to ignore this coding style violation.
import bird_spotter.views  # noqa: E402  pylint: disable=wrong-import-position
import bird_spotter.model  # noqa: E402  pylint: disable=wrong-import-position

# Import views
import bird_spotter.views.index
