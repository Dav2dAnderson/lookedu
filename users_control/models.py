from django.db import models
from django.contrib.auth.models import AbstractUser




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
    have_right_to_add = models.BooleanField(default=False)


    REQUIRED_FIELDS = ['phone_number']

    def __str__(self):
        return self.username
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    

class ContactMessage(models.Model):
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'

