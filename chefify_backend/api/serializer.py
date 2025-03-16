from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, Cuisine, RecipeSteps, Review

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        user = User(
            username = validated_data['username'],
            email = validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class CuisineSerializer(ModelSerializer):
   class Meta:
       model = Cuisine
       fields = '__all__' 

class RecipeSerializer(ModelSerializer):
    user = UserSerializer()
    cuisine = CuisineSerializer()
    class Meta:
        model = Recipe
        fields = '__all__'

class RecipeStepsSerializer(ModelSerializer):
    recipe = RecipeSerializer()
    class Meta:
        model = RecipeSteps
        fields = '__all__'

class ReviewSerializer(ModelSerializer):
    user = UserSerializer()
    recipe = RecipeSerializer()
    class Meta:
        model = Review
        fields = '__all__'