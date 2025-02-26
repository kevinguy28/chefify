from django.db import models
from django.contrib.auth.models import User

class Cuisine(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    STATUS_CHOICES = {
        'private': 'Private',
        'public': 'Public',
        'friends': 'Friends',
    }
    RATING_CHOICES = [(i/2, str(i/2)) for i in range(0, 11)]
    name = models.CharField(max_length=50)
    cuisine = models.ForeignKey(Cuisine, on_delete=models.SET_NULL, null=True, blank=True)
    privacy = models.CharField(max_length=15, choices=STATUS_CHOICES, default='private')
    description = models.TextField(max_length=200, blank=True)
    image = models.ImageField(upload_to='images/recipes/', blank=True, null=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name