from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import AbstractUser

# Create your models here.


 # All times are stored in minutes

class User(AbstractUser):
    ''' 
    User model.
    
    Username, password, email, verified, weekly_study_time.
    '''

    email = models.EmailField(unique=True)
        # Users must verify themselves via email
    verified = models.BooleanField(default=False)

        # Defined when signing up and can be changed in user settings
        # Used as a guide, what really matters is subject time distribution
    weekly_study_time = models.IntegerField(default=0, null=False, validators=[MinValueValidator(0)])
    
class Friend(models.Model):
    '''
    Friend model.

    Contains the sender of the friend request and the recipient.
    A friend request with a `False` state on the `accepted` column has been sent but not accepted.    
    '''

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    accepted = models.BooleanField(default=False)


class SubjectCategory(models.Model):
    '''
    All subject must have a category that gives them a color 
    Categories also allow users to challenge each other
        Users can only challenge other users to study-offs of the same category
    '''

    name = models.CharField(max_length=50, null=True)
    color = models.CharField(max_length=50, null=True)

    def __str__(self):
        return f"{self.name}, {self.color}"

class Subject(models.Model):
    ''' 
    Subject model.

    Contains the amount of time a user assigned to the subject and what days they want to study it.
    '''

    name = models.CharField(max_length=50)
    category = models.ForeignKey(SubjectCategory, on_delete=models.CASCADE, related_name='subjects', null=True)
    weekly_study_time = models.IntegerField(validators=[MinValueValidator(0)])
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subjects')    