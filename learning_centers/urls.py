from django.urls import path, include

from rest_framework.routers import DefaultRouter

from .views import CentersView, ApplicationsView, CoursesView, EducentersApplicationsView

routers = DefaultRouter()

routers.register('educenters', CentersView, basename='educenters')
routers.register('my-applications', ApplicationsView, basename='applications')
routers.register('courses', CoursesView, basename='courses')
routers.register('my-educenters-applications', EducentersApplicationsView, basename='educenters-applications')

urlpatterns = [
    path('', include(routers.urls))
]