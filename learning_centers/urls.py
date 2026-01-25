from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import CentersView

routers = DefaultRouter()

routers.register('educenters', CentersView, basename='educenters')

urlpatterns = [
    path('', include(routers.urls))
]