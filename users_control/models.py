from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.



class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=13, unique=True)
    # picture = models.ImageField(upload_to='users_pictures/', null=True, blank=True)

    REQUIRED_FIELDS = ['phone_number']

    def __str__(self):
        return self.username