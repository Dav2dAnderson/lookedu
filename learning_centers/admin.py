from django.contrib import admin

from .models import Courses, Educenters
# Register your models here.


@admin.register(Educenters)
class EduAdmin(admin.ModelAdmin):
    list_display = ['name', 'bio']


@admin.register(Courses)
class CoursesAdmin(admin.ModelAdmin):
    list_display = ['title']
