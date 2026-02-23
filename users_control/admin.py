from django.contrib import admin

from .models import CustomUser, Roles
# Register your models here.


@admin.register(Roles)
class RoleAdmin(admin.ModelAdmin):
    list_display = ["name"]


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email', 'phone_number', 'role']





