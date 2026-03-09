from django.contrib import admin

from .models import CustomUser, Roles, ContactMessage
# Register your models here.


@admin.register(Roles)
class RoleAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'role']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'created_date']




