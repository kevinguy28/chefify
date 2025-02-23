from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, Cuisine

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

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

    class Meta:
        model = Recipe
        fields = '__all__'