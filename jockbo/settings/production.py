from jockbo.settings.base import *
import dj_database_url, os

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

DEBUG = True

ALLOWED_HOSTS = ['.herokuapp.com']

CORS_ORIGIN_ALLOW_ALL = True
DATABASES = {
    'default': {}
}

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)