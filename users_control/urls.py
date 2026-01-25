from django.urls import path

from .views import UserRegistrationView,  UserLogOutView

urlpatterns = [
    path('user/register/', UserRegistrationView.as_view()),
    path('user/logout/', UserLogOutView.as_view())
]

