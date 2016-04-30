"""
Django settings for mapplop project.

Generated by 'django-admin startproject' using Django 1.8.5.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
from os import environ

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '_u!7vqh*yqa4_9uke=#y811ev_pnj-@c_$9175$9y-z)xb6m-^'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['herokuapp.com', 'mapplop.com', 'www.mapplop.com', 
                'lit-sands-1894.herokuapp.com', '*']

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'mapplop.news@gmail.com'
EMAIL_HOST_PASSWORD = 'maPPloP1qaz!QAZ'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

ADMINS = (('Joshua', 'J-kozlowski@live.com'),)


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.gis',
    'rest_framework',
    'rest_framework_gis',
    'storages',
    'venues',
    'posts',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'mapplop.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mapplop.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'mapplopawsdb',
        'USER': 'mapmaster',
        'HOST': 'mapplopawsdb.clnekr4nlkeb.us-east-1.rds.amazonaws.com',
        'PORT': '5432',
        'PASSWORD': 'maPP10PDBMAP$'
    }
}


SERIALIZATION_MODULES = {
    'geojson': 'django.contrib.gis.serializers.geojson',
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/New_York'

USE_I18N = True

USE_L10N = True

USE_TZ = True

GEOS_LIBRARY_PATH = environ.get('GEOS_LIBRARY_PATH')
GDAL_LIBRARY_PATH = environ.get('GDAL_LIBRARY_PATH')


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

# STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'



# Amazon S3 
AWS_STORAGE_BUCKET_NAME = 'mapplopstaticmedia'
AWS_ACCESS_KEY_ID = 'AKIAJLROC5E62X2OR35Q'
AWS_SECRET_ACCESS_KEY = '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'
AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME
AWS_PRELOAD_METADATA = True

AWS_HEADERS = {  # see http://developer.yahoo.com/performance/rules.html#expires
        'Expires': 'Thu, 31 Dec 2099 20:00:00 GMT',
        'Cache-Control': 'max-age=94608000',
}

MEDIA_ROOT = 'media'
MEDIAFILES_LOCATION = 'media'
MEDIA_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, MEDIAFILES_LOCATION)
DEFAULT_FILE_STORAGE = 'mapplop.custom_storages.MediaStorage'
# DEFAULT_FILE_STORAGE = 'storages.backends.s3boto.S3BotoStorage'

STATICFILES_LOCATION = 'static'

if not DEBUG:
    STATICFILES_STORAGE = 'mapplop.custom_storages.StaticStorage'
    # STATICFILES_STORAGE = 'storages.backends.s3boto.S3BotoStorage'
    STATIC_URL = "https://%s/%s/" % (AWS_S3_CUSTOM_DOMAIN, STATICFILES_LOCATION)

if DEBUG:
    STATIC_URL = '/static/'
    STATIC_ROOT = 'staticfiles'
    STATICFILES_DIRS =(
        os.path.join(BASE_DIR, 'static'),
    )
