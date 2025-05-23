"""Bird Spotter development configuration."""

import pathlib

# Root of this application, useful if it doesn't occupy an entire domain
APPLICATION_ROOT = './'

# Secret key for encrypting cookies TODO
# SECRET_KEY = 'FIXME SET WITH: $ python3 -c "import os; print(os.urandom(24))" '
SESSION_COOKIE_NAME = 'login'

# File Upload to var/uploads/
BIRD_SPOTTER_ROOT = pathlib.Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = BIRD_SPOTTER_ROOT/'var'/'uploads'
ALLOWED_EXTENSIONS = set(['.png', '.jpg', '.jpeg', '.gif'])
MAX_CONTENT_LENGTH = 16 * 1024 * 1024

# Database file is var/insta485.sqlite3
# DATABASE_FILENAME = BIRD_SPOTTER_ROOT/'var'/ TODO
# 数据库配置
# DB_HOST = "localhost"
# DB_USER = "root"
# DB_PASSWORD = "123456"
# DB_NAME = "411_Database"