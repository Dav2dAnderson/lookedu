from django.apps import AppConfig


class UsersControlConfig(AppConfig):
    name = 'users_control'
    default_auto_field = 'django.db.models.BigAutoField'

    def ready(self):
        import users_control.signals

