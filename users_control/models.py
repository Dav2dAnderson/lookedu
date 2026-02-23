from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class Roles(models.Model):

    ROLE_NAME = (
        ('admin', 'admin'),
        ('user', 'user'),
        ('edu_owner', 'edu_owner')
    )

    name = models.CharField(max_length=50, choices=ROLE_NAME)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'


class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=20, unique=True)
    role = models.ForeignKey(Roles, on_delete=models.CASCADE, null=True, blank=True)
    # picture = models.ImageField(upload_to='users_pictures/', null=True, blank=True)

    REQUIRED_FIELDS = ['phone_number']

    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    

