from django.contrib.auth import get_user_model, authenticate # Get the custom user
from rest_framework import serializers
from .models import *

User = get_user_model()

class SignupUserSerializer(serializers.ModelSerializer): # DRF docs are nuts. Thank you guys
    '''
    Process sign up data
    '''

    repeat_password = serializers.CharField(write_only=True) # Won't work otherwise
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

class SigninUserSerializer(serializers.Serializer):
    '''
    Processes sign in data and authenticates user 
    '''

    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        if not data['username']:
            raise serializers.ValidationError('Must include username')
        if not data['password']:
            raise serializers.ValidationError('Must include password')
        
        user = authenticate(
            username=data['username'],
            password=data['password']
        )

        if user is None:
            raise serializers.ValidationError('Invalid information')        
        
        return {'user': user}

class CategorySerializer(serializers.ModelSerializer):
    '''
    Turns all categories from DB to JSON
    '''

    class Meta:
        model = SubjectCategory
        fields = ['id', 'name', 'color']

class SubjectSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Subject
        fields = '__all__'