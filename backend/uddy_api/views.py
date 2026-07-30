import json
from datetime import date, timedelta

from django.core.mail import send_mail
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from uddy_api.serializers import *

# Create your views here.

class SignUp(APIView):
   
    def post(self, request):
        serializer = SignupUserSerializer(data=request.data)

        if serializer.is_valid():
                # Will call the `create` method inside the serializer because the serializer was called with just `data` as a param
            user = serializer.save()
            email = serializer.data['email']
            send_mail(
                subject='Uddy accounts', # TODO; send a confirmation email ->
                message='This will be a confirmation email.', 
                    # Sender email... Apparently doesn't really matter
                from_email='uddy@email.com',
                    # The user's email.
                recipient_list=[email],
            )
            return Response({
                'message': 'User created', 
                'username': user.username
            }, 
            status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
        
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
    

class SignIn(APIView):
    
    def post(self, request):
        serializer = SigninUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

                # Create a token
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
        
class LogOut(APIView):

    
    def post(self, request):
        serializer = SigninUserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']

                # Create a token
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)

class Categories(APIView):
    '''
    Sends all categories and their (TailwindCSS) colors
    '''
    
    def get(self, request):
        categories = SubjectCategory.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CreateSubject(APIView):

    '''
    Saves a subject in the DB
    '''

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = SubjectSerializer(data=request.data)

        if serializer.is_valid():
            cat_id = request.data.get("category")
            category_obj = None
            if cat_id and cat_id != "none":
                category_obj = SubjectCategory.objects.filter(id=cat_id).first()
            serializer.save(user=request.user, category=category_obj)
            return Response(serializer.data, status=201)
        print(serializer.errors)

        return Response(serializer.errors, status=400)
    
class SubjectList(APIView):

    '''
    Query for the subject under a user's id in the DB and send it to the frontend
    '''
            # Check if user is authenticated
    permission_classes = [IsAuthenticated]

    def get(self, request):

        subjects = Subject.objects.filter(user=request.user)

        serializer = SubjectSerializer(subjects, many=True)
        
        return Response(serializer.data)

class GetSubject(APIView):
    '''
    Get a single subject's data
    '''

    def get(self, request, subject_id): # Receive subject_id from the URL path

        try:
            subject = Subject.objects.get(id=subject_id, user=request.user)
            serializer = SubjectSerializer(subject)

            return Response(serializer.data)
        
        except Subject.DoesNotExist:
            
            return Response({"error": "Subject not found"}, status=404)

class AddStudyTime(APIView):

    '''
    Save a study session to the DB
    '''

    permission_classes = [IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get("subject_id")
        minutes = int(request.data.get("minutes", 0))

        if not subject_id or minutes <= 0:
            return Response({"error": "Invalid data"}, status=400)

        try:
            subject = Subject.objects.get(id=subject_id, user=request.user)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=404)

        # Calculate start of week.
        today = date.today()
        first_day = today - timedelta(days=today.weekday())

            # Very useful notation. Would've saved me a lot of time in flexr.
        session, created = WeeklyStudy.objects.get_or_create(
            user=request.user,
            subject=subject,
            week_start=first_day
        )

        session.total_minutes += minutes
        session.save()

        return Response({
            "subject": subject.name,
            "first_day": first_day,
            "total_minutes": session.total_minutes
        })
    
    # TODO; Create a view to compile all recap data 
        # Username
        # Subjects and weekly study time goal
        # Current week study time (per subject)

class WeeklyRecap(APIView):
        # Only for auth users
    permission_classes = [IsAuthenticated]

    def get(self, request):
            # Get all subjects from a user
        subjects = Subject.objects.filter(user=request.user)

        serializer = WeeklyRecapSerializer(
            subjects,
            many=True,
            context={"request": request} # Pass extra data, such as user, etc
        )

        return Response(serializer.data)


class UpdateSubjectGoal(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subject_id = request.data.get("subject_id")
        weekly_study_time_hours = float(request.data.get("weekly_study_time", 0))

        if not subject_id or weekly_study_time_hours < 0:
            return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subject = Subject.objects.get(id=subject_id, user=request.user)
            subject.weekly_study_time = int(weekly_study_time_hours * 60)
            subject.save()
            return Response({"message": "Goal updated successfully", "weekly_study_time": subject.weekly_study_time}, status=status.HTTP_200_OK)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)


class DeleteSubject(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, subject_id):
        try:
            subject = Subject.objects.get(id=subject_id, user=request.user)
            subject.delete()
            return Response({"message": "Subject deleted successfully"}, status=status.HTTP_200_OK)
        except Subject.DoesNotExist:
            return Response({"error": "Subject not found"}, status=status.HTTP_404_NOT_FOUND)


class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FriendList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Accepted friends where user is sender or recipient
        accepted_friends = Friend.objects.filter(
            Q(sender=request.user) | Q(recipient=request.user),
            accepted=True
        )
        # Incoming pending requests where user is recipient
        incoming_requests = Friend.objects.filter(
            recipient=request.user,
            accepted=False
        )

        friends_data = FriendSerializer(accepted_friends, many=True).data
        requests_data = FriendSerializer(incoming_requests, many=True).data

        return Response({
            "friends": friends_data,
            "incoming_requests": requests_data
        }, status=status.HTTP_200_OK)


class SendFriendRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipient_id = request.data.get("recipient_id")
        if not recipient_id:
            return Response({"error": "recipient_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient_id = int(recipient_id)
        except ValueError:
            return Response({"error": "Invalid recipient ID format."}, status=status.HTTP_400_BAD_REQUEST)

        if recipient_id == request.user.id:
            return Response({"error": "You cannot send a friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({"error": "User with this ID does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Check if relationship already exists
        existing = Friend.objects.filter(
            Q(sender=request.user, recipient=recipient) | Q(sender=recipient, recipient=request.user)
        ).first()

        if existing:
            if existing.accepted:
                return Response({"error": "You are already friends with this user."}, status=status.HTTP_400_BAD_REQUEST)
            elif existing.sender == request.user:
                return Response({"error": "You already sent a friend request to this user."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "This user already sent you a friend request. Check your incoming requests!"}, status=status.HTTP_400_BAD_REQUEST)

        friend_req = Friend.objects.create(sender=request.user, recipient=recipient, accepted=False)
        serializer = FriendSerializer(friend_req)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RespondFriendRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request_id = request.data.get("request_id")
        action = request.data.get("action")  # 'accept' or 'decline'

        if not request_id or action not in ["accept", "decline"]:
            return Response({"error": "Valid request_id and action ('accept' or 'decline') are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend_req = Friend.objects.get(id=request_id, recipient=request.user, accepted=False)
        except Friend.DoesNotExist:
            return Response({"error": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)

        if action == "accept":
            friend_req.accepted = True
            friend_req.save()
            return Response({"message": "Friend request accepted."}, status=status.HTTP_200_OK)
        else:
            friend_req.delete()
            return Response({"message": "Friend request declined."}, status=status.HTTP_200_OK)


class SendChallenge(APIView):
    '''
    Send a study challenge to a friend for a specific category
    '''
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipient_id = request.data.get("recipient_id")
        category_id = request.data.get("category_id")

        if not recipient_id or not category_id:
            return Response({"error": "recipient_id and category_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipient_id = int(recipient_id)
            category_id = int(category_id)
        except ValueError:
            return Response({"error": "Invalid ID format."}, status=status.HTTP_400_BAD_REQUEST)

        if recipient_id == request.user.id:
            return Response({"error": "You cannot challenge yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # Verify they are friends
        is_friend = Friend.objects.filter(
            Q(sender=request.user, recipient_id=recipient_id) | Q(sender_id=recipient_id, recipient=request.user),
            accepted=True
        ).exists()

        if not is_friend:
            return Response({"error": "You can only challenge friends."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category = SubjectCategory.objects.get(id=category_id)
        except SubjectCategory.DoesNotExist:
            return Response({"error": "Category not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            recipient = User.objects.get(id=recipient_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check for existing pending challenge between these users for this category
        existing = Challenge.objects.filter(
            sender=request.user,
            recipient=recipient,
            category=category,
            status='pending'
        ).exists()

        if existing:
            return Response({"error": "You already have a pending challenge with this user for this category."}, status=status.HTTP_400_BAD_REQUEST)

        challenge = Challenge.objects.create(
            sender=request.user,
            recipient=recipient,
            category=category,
            status='pending'
        )

        serializer = ChallengeSerializer(challenge)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ChallengesList(APIView):
    '''
    List all challenges involving the current user (sent and received)
    '''
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Pending challenges received by this user
        incoming = Challenge.objects.filter(
            recipient=request.user,
            status='pending'
        )
        # Pending challenges sent by this user
        outgoing = Challenge.objects.filter(
            sender=request.user,
            status='pending'
        )

        incoming_data = ChallengeSerializer(incoming, many=True).data
        outgoing_data = ChallengeSerializer(outgoing, many=True).data

        return Response({
            "incoming": incoming_data,
            "outgoing": outgoing_data,
        }, status=status.HTTP_200_OK)


class RespondChallenge(APIView):
    '''
    Accept or decline a challenge
    '''
    permission_classes = [IsAuthenticated]

    def post(self, request):
        challenge_id = request.data.get("challenge_id")
        action = request.data.get("action")  # 'accept' or 'decline'

        if not challenge_id or action not in ["accept", "decline"]:
            return Response({"error": "Valid challenge_id and action ('accept' or 'decline') are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            challenge = Challenge.objects.get(id=challenge_id, recipient=request.user, status='pending')
        except Challenge.DoesNotExist:
            return Response({"error": "Challenge not found."}, status=status.HTTP_404_NOT_FOUND)

        if action == "accept":
            challenge.status = 'accepted'
            challenge.save()
            return Response({"message": "Challenge accepted."}, status=status.HTTP_200_OK)
        else:
            challenge.status = 'declined'
            challenge.save()
            return Response({"message": "Challenge declined."}, status=status.HTTP_200_OK)