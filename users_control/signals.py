from django.conf import settings
from django.core.mail import send_mail
from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import CustomUser


@receiver(post_save, sender=CustomUser)
def send_welcome_email(sender, instance, created, **kwargs):
    if created and instance.email:
        try:
            send_mail(
                "Welcome!",
                "Thanks for registering.",
                settings.EMAIL_HOST_USER,
                [instance.email],
                fail_silently=False
            )
        except Exception as e:
            print(f"Registration email failed to send: {e}")
