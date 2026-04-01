from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import CustomUser

from django.core.mail import EmailMessage, get_connection

@receiver(post_save, sender=CustomUser)
def send_welcome_email(sender, instance, created, **kwargs):
    if created and instance.email:
        try:
            connection = get_connection('django.core.mail.backends.smtp.EmailBackend')

            email = EmailMessage(
                subject="Welcome!",
                body="Thanks for registering.",
                from_email=settings.EMAIL_HOST_USER,
                to=[instance.email],
                connection=connection
            )

            email.send(fail_silently=False)

        except Exception as e:
            print(f"Registration email failed to send: {e}")
