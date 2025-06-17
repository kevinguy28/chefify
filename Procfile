release: python manage.py migrate && python manage.py collectstatic --noinput
web: gunicorn chefify_backend.chefify_backend.wsgi --bind 0.0.0.0:$PORT --log-file -
