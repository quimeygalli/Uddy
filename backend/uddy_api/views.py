import json
from datetime import date, timedelta



from django.core.mail import send_mail

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

        print(request.user)

        print(request.data)

        serializer = SubjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
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
        
        for subject in serializer.data:
            print(subject['category'])
        return Response(serializer.data)

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
            first_day=first_day
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

    permission_classes = [IsAuthenticated]

    def get(self, request):
        subjects = Subject.objects.filter(user=request.user)

        serializer = WeeklyRecapSerializer(
            subjects,
            many=True,
            context={"request": request} # Pass extra data, such as user, etc
        )

        return Response(serializer.data)