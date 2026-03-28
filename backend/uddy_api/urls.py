from django.urls import path

from .views import *

urlpatterns = [ # All fetch calls in frontend must start with `/api/`
    path('signup', SignUp.as_view()),
    path('signin', SignIn.as_view()),
    path('categories', Categories.as_view()),
]