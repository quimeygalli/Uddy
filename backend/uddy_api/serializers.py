from datetime import date, timedelta

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
        
        return {'user': user} # For some reason a dict must be returned

class CategorySerializer(serializers.ModelSerializer):
    '''
    Turns all categories from DB to JSON
    '''

    class Meta:
        model = SubjectCategory
        fields = ['id', 'name', 'color']

class CatrgorySerializer(serializers.ModelSerializer):

    class Meta:
        model = SubjectCategory
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):

    '''
    Saves a subject to the DB
    '''

    category = CategorySerializer(read_only=True)
    
    class Meta:
        model = Subject
        fields = '__all__'
        read_only_fields = ["user"]
    
    def validate(self, data):
            # Convert hours to minutes.
        data['weekly_study_time'] = data['weekly_study_time'] * 60 
        
        return data
    
    def to_representation(self, instance): # DRF gets crazy deep.
        data = super().to_representation(instance)

        if data.get('weekly_study_time') is not None: # Sometimes will not work without this check... Investigate
            data['weekly_study_time'] = data['weekly_study_time'] / 60

        return data
    
class WeeklyRecapSerializer(serializers.ModelSerializer):
    '''
    Checks for last week activity (amount of time studied for each subject)
    '''

    studied_minutes = serializers.SerializerMethodField() # DRF is crazy good

    class Meta:
        model = Subject
        fields = ["id", "name", "weekly_study_time", "studied_minutes"]

    def get_studied_minutes(self, obj):
            # Passed later
        request = self.context.get("request")

            # Calculate days since week started
        today = date.today()
        week_start = today - timedelta(days=today.weekday())

        try:
            week = WeeklyStudy.objects.get(
                user=request.user,
                subject=obj,
                week_start=week_start
            )
            return week.total_minutes
        except WeeklyStudy.DoesNotExist:
            # Edge case where a user didnt study at all
            return 0