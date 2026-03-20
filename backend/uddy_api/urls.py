from django.urls import path

from .views import TestSignUp

urlpatterns = [
    path('signup/', TestSignUp.as_view())
]