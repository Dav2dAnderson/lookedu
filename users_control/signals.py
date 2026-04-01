from django.conf import settings
from django.core.mail import send_mail, EmailMessage
from django.dispatch import receiver
from django.db.models.signals import post_save

from .models import CustomUser


@receiver(post_save, sender=CustomUser)
def send_welcome_email(sender, instance, created, **kwargs):
    if created and instance.email:
        try:
            email = EmailMessage(
                subject="Welcome!",
                body="Thanks for registering.",
                from_email=settings.EMAIL_HOST_USER,
                to=[instance.email],
            )
            email.send(fail_silently=False)
        except Exception as e:
            print(f"Registration email failed to send: {e}")
