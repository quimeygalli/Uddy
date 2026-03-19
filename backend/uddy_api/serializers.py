from django.contrib.auth import get_user_model # Get the custom user
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer): # DRF docs are nuts. Thank you guys
    '''
    Process sign up data
    '''

    repeat_password = serializers.CharField()
    class Meta:
        model = User 
        fields = ['username', 'email', 'password', 'repeat_password']
        # TODO; check if safe


    def validate(self, data):
        if not data['email']:
            raise serializers.ValidationError('Must include email')
        if data['password'] != data['repeat_password']:
            raise serializers.ValidationError('Passwords do not match') # serializer lib comes with lots of helpful stff
        
        return data

        # Overriding the default create method. 
        # We do this because the default create method does not hash and salt the password before.
        # The Django `create_user` method does.
    def create(self, validated_data): 
        validated_data.pop('repeat_password')
        return User.objects.create_user(**validated_data)
