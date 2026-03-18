from rest_framework.views import APIView
from rest_framework.response import Response

from uddy_api.serializers import UserSerializer

# Create your views here.

class TestSignUp(APIView):
    # Working
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User created', 
                'username': user.username
            })
        return Response(serializer.errors, status=400)