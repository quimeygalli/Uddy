from django.contrib.auth import get_user_model # Get the custom user
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer): # DRF docs are nuts. Thank you guys
    '''
    
    '''
    class Meta:
        model = User 
        fields = ['username', 'password']
        # TODO; check if safe

        # Overriding the default create method. 
        # We do this because the default create method does not hash and salt the password before.
        # The Django `create_user` method does.
    def create(self, validated_data): 
        return User.objects.create_user(**validated_data)
