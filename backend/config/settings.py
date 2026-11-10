
from pathlib import Path

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent


# ==================================
# SECURITY SETTINGS
# ==================================

# Replace this with a newly generated secret key.
# Keep it private and never upload it to GitHub.
SECRET_KEY = 'uOtJWiwc7qBlV732fSW1_0-mYut1m_CU3Zi8IzC00ldQoXQ5BYsll8LrppcKmtP31gQ'

DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
]


# ==================================
# APPLICATION DEFINITION
# ==================================

INSTALLED_APPS = [
    # Django built-in apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'corsheaders',

    # GRIDLINE local apps
    'users',
    'products',
    'cart',
    'orders',
]


# ==================================
# MIDDLEWARE
# ==================================

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    # React and Django connection
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'config.urls'


# ==================================
# TEMPLATES
# ==================================

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'config.wsgi.application'


# ==================================
# DATABASE CONFIGURATION
# ==================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# ==================================
# PASSWORD VALIDATION
# ==================================

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# ==================================
# CUSTOM USER MODEL
# ==================================

AUTH_USER_MODEL = 'users.User'


# ==================================
# INTERNATIONALIZATION
# ==================================

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Manila'

USE_I18N = True

USE_TZ = True


# ==================================
# STATIC AND MEDIA FILES
# ==================================

STATIC_URL = 'static/'

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'


# ==================================
# DJANGO REST FRAMEWORK
# ==================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],

    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}


# ==================================
# CORS CONFIGURATION
# ==================================

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]


# ==================================
# EMAIL CONFIGURATION
# ==================================

MAILERS = {
    'default': {
        'BACKEND': 'django.core.mail.backends.console.EmailBackend',
    },
}


# ==================================
# DEFAULT PRIMARY KEY
# ==================================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
