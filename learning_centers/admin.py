from django.contrib import admin

from .models import Courses, Educenters, Application
# Register your models here.


@admin.register(Educenters)
class EduAdmin(admin.ModelAdmin):
    list_display = ['name', 'info']


@admin.register(Courses)
class CoursesAdmin(admin.ModelAdmin):
    list_display = ['title']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['owner', 'center', 'course']