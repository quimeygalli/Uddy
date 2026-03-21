from django.urls import path

from .views import TestSignUp

urlpatterns = [ # All fetch calls in frontend must start with `/api/`
    path('signup', TestSignUp.as_view())
]