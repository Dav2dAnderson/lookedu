from django.urls import path

from .views import UserRegistrationView,  UserLogOutView, MeView

urlpatterns = [
    path('user/register/', UserRegistrationView.as_view()),
    path('user/logout/', UserLogOutView.as_view()),
    path('api/me/', MeView.as_view(), name='me'),
]

