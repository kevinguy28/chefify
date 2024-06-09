from django.db import models
from django import forms
from django.contrib.auth.models import User

# Create your models here.

class Categories(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=30, unique=True)
    # category =
    # calories = 
    def __str__(self):
        return self.name
    
class Recipe(models.Model):
    name = models.CharField(max_length=50)
    categories = models.ForeignKey(Categories, on_delete=models.SET_NULL, null= True, blank=True)
    culinarian = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    calories = models.IntegerField(null=True, blank=True)
    ingredients_list = models.ManyToManyField(Ingredient)
    review = models.IntegerField(null=True, blank=True)
    private = models.BooleanField(default=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Profile(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_recipe_list = models.ManyToManyField(Recipe, blank=True)
    user_ingredients_list = models.ManyToManyField(Ingredient, blank=True)
    
    def __str__(self):
        return self.user.username


    