from django.core.mail import send_mail

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from uddy_api.serializers import UserSerializer

# Create your views here.

class TestSignUp(APIView):
    # Working
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
                # Will call the `create` method inside the serializer because the serializer was called with just `data` as a param
            user = serializer.save()
            serializer.data['email']
            send_mail(
                'hello',
                'body of the message hehe',
                'elon@email.com',
                [serializer.data['email']],
                fail_silently=False
            )
            return Response({
                'message': 'User created', 
                'username': user.username
            }, 
            status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)