from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView # Manage JWTs lifepan


from .views import *

urlpatterns = [ # All fetch calls in frontend must start with `/api/`
    
    # Signup / Signin

    path('signup', SignUp.as_view()),
    path('signin', SignIn.as_view()),
    path('verify-code', VerifyCode.as_view()),
    path("token-refresh", TokenRefreshView.as_view()),
    path("logout", LogOut.as_view()),


    # Subjects

    path('categories', Categories.as_view()),
    path('create-subject', CreateSubject.as_view()),
    path('subject-list', SubjectList.as_view()),
    path('get-subject/<int:subject_id>', GetSubject.as_view()),
    path("add-time", AddStudyTime.as_view()), # Save time to the weekly study table
    path("update-goal", UpdateSubjectGoal.as_view()),
    path("delete-subject/<int:subject_id>", DeleteSubject.as_view()),
    path("weekly-recap", WeeklyRecap.as_view()),

    # User & Friends
    path('me', UserProfile.as_view()),
    path('friends-list', FriendList.as_view()),
    path('send-friend-request', SendFriendRequest.as_view()),
    path('respond-friend-request', RespondFriendRequest.as_view()),

    # Challenges
    path('send-challenge', SendChallenge.as_view()),
    path('challenges-list', ChallengesList.as_view()),
    path('respond-challenge', RespondChallenge.as_view()),
    path('log-challenge-time', LogChallengeTime.as_view()),
    path('challenge-history/<int:friend_id>', ChallengeHistory.as_view()),
]