from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, Cuisine, RecipeSteps, Review, Ingredient, UserProfile, RecipeIngredient, RecipeComponent

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
    likedBy = UserSerializer(many=True)
    dislikedBy = UserSerializer(many=True)
    class Meta:
        model = Review
        fields = '__all__'

class IngredientSerializer(ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class UserProfileIngredientListSerializer(ModelSerializer):
    ownedIngredients = IngredientSerializer(many=True)
    buyIngredients = IngredientSerializer(many=True)
    favouriteRecipes = RecipeSerializer(many=True)
    class Meta:
        model = UserProfile
        fields = ['ownedIngredients', 'buyIngredients', 'id']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['ownedIngredients'] = sorted(representation['ownedIngredients'], key=lambda x: x['ingredientType'].lower())
        representation['buyIngredients'] = sorted(representation['buyIngredients'], key=lambda x: x['ingredientType'].lower())
        return representation
    
class RecipeIngredientSerializer(ModelSerializer):
    recipe = RecipeSerializer()
    ingredient = IngredientSerializer()
    
    class Meta:
        model = RecipeIngredient
        fields = '__all__'

class RecipeComponentSerializer(ModelSerializer):
    recipe = RecipeSerializer()
    
    class Meta:
        model = RecipeComponent
        fields = '__all__'