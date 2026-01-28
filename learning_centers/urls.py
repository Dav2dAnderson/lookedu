from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import CentersView, ApplicationsView, CoursesView

routers = DefaultRouter()

routers.register('educenters', CentersView, basename='educenters')
routers.register('applications', ApplicationsView, basename='applications')
routers.register('courses', CoursesView, basename='courses')

urlpatterns = [
    path('', include(routers.urls))
]