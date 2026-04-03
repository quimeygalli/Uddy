from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView # Manage JWTs lifepan


from .views import *

urlpatterns = [ # All fetch calls in frontend must start with `/api/`
    
    # Signup / Signin

    path('signup', SignUp.as_view()),
    path('signin', SignIn.as_view()),
    path("token-refresh", TokenRefreshView.as_view()),


    # Subjects

    path('categories', Categories.as_view()),
    path('create-subject', CreateSubject.as_view()),
    path('subject-list', SubjectList.as_view()),
    path("add-time/", AddStudyTime.as_view()), # Save time to the weekly study table
]