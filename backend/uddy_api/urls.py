from django.urls import path

from .views import TestSignUp

urlpatterns = [
    path('test_signup/', TestSignUp.as_view())
]