import random
import string
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


def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))


class EmailVerificationToken(models.Model):
    '''
    Stores a 6-digit numeric code linked to a user for email verification.
    Has no expiry. Deleted once the user verifies their email.
    '''
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='verification_token')
    code = models.CharField(max_length=6, default=generate_verification_code)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Verification code for {self.user.username}"

    
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
        Users can only challenge other users to study-offs of the same category of subject
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

    def __str__(self):
        return f'Subject: {self.name}, user: {self.user}'
    
class WeeklyStudy(models.Model):

    '''  
    Saves a study session in the DB.

    Multiple weekly sessions get stored in the same row
    '''

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    week_start = models.DateField()  # Monday of current week
    total_minutes = models.IntegerField(default=0)

    class Meta:
            # Avoid the duplicate sessions. Investigate if bug is caused because npm server is dev
        unique_together = ("user", "subject", "week_start")


class Challenge(models.Model):
    '''
    Challenge model.

    A user can challenge a friend to study a specific category.
    Lifecycle: pending -> accepted -> recipient_done -> completed (or declined).
    When accepted, the recipient studies first and logs their time.
    Then the sender studies and logs theirs. Both scores are saved.
    '''

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('recipient_done', 'Recipient Done'),
        ('completed', 'Completed'),
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_challenges')
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_challenges')
    category = models.ForeignKey(SubjectCategory, on_delete=models.CASCADE, related_name='challenges')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    recipient_minutes = models.IntegerField(default=0)
    sender_minutes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Challenge: {self.sender} -> {self.recipient} ({self.category.name}) [{self.status}]"