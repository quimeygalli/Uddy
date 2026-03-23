from django.core.mail import send_mail

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import login, logout

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
            user = serializer.validated_data
            login(request, user['user'])

            return Response({
                'message': 'valid_user' # Frontend can proceed
                },
                status=status.HTTP_202_ACCEPTED)
        
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
