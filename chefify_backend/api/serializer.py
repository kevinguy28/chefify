"""
serializer.py

This module defines serializers for the API application that converts
complex data types, ie. Django Model Instances, into native python
datatypes that can be rendered JSON/XML.

"""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import (
    Cuisine,
    Ingredient,
    Recipe,
    RecipeComponent,
    RecipeIngredient,
    RecipeSteps,
    Review,
    UserProfile,
)

User = get_user_model()


class UserSerializer(ModelSerializer):
    """Serializes User model."""

    class Meta:
        model = User
        fields = "__all__"


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializes User Registration Data."""

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = "__all__"

    def create(self, validated_data):
        user = User(username=validated_data["username"], email=validated_data["email"])
        user.set_password(validated_data["password"])
        user.save()
        return user


class CuisineSerializer(ModelSerializer):
    """Serializes Cuisine data."""

    class Meta:
        model = Cuisine
        fields = "__all__"


class RecipeSerializer(ModelSerializer):
    """Serializes Recipe data."""

    user = UserSerializer()
    cuisine = CuisineSerializer()

    class Meta:
        model = Recipe
        fields = "__all__"


class RecipeStepsSerializer(ModelSerializer):
    """Serialize Recipe Steps data."""

    recipe = RecipeSerializer()

    class Meta:
        model = RecipeSteps
        fields = "__all__"


class ReviewSerializer(ModelSerializer):
    """Serialize Review data."""

    user = UserSerializer()
    recipe = RecipeSerializer()
    likedBy = UserSerializer(many=True)
    dislikedBy = UserSerializer(many=True)
    userProfile = UserProfile()

    class Meta:
        model = Review
        fields = "__all__"


class IngredientSerializer(ModelSerializer):
    """Serializes Ingredient data."""

    class Meta:
        model = Ingredient
        fields = "__all__"


class UserProfileSerializer(ModelSerializer):
    """Serialize User Profile data."""

    user = UserSerializer()
    favouriteRecipes = RecipeSerializer(many=True)
    ownedIngredients = IngredientSerializer(many=True)
    buyIngredients = IngredientSerializer(many=True)
    friendsList = UserSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["ownedIngredients"] = sorted(
            representation["ownedIngredients"],
            key=lambda x: x["ingredientType"].lower(),
        )
        representation["buyIngredients"] = sorted(
            representation["buyIngredients"], key=lambda x: x["ingredientType"].lower()
        )
        return representation


class UserProfileIngredientListSerializer(ModelSerializer):
    """Serializes User Profile Ingredient Data."""

    ownedIngredients = IngredientSerializer(many=True)
    buyIngredients = IngredientSerializer(many=True)

    class Meta:
        model = UserProfile
        fields = ["ownedIngredients", "buyIngredients", "id"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["ownedIngredients"] = sorted(
            representation["ownedIngredients"],
            key=lambda x: x["ingredientType"].lower(),
        )
        representation["buyIngredients"] = sorted(
            representation["buyIngredients"], key=lambda x: x["ingredientType"].lower()
        )
        return representation


class RecipeIngredientSerializer(ModelSerializer):
    """Serializes Recipe Ingredient data."""

    recipe = RecipeSerializer()
    ingredient = IngredientSerializer()

    class Meta:
        model = RecipeIngredient
        fields = "__all__"


class RecipeComponentSerializer(ModelSerializer):
    """Serializes Recipe Component Data."""

    recipe = RecipeSerializer()

    class Meta:
        model = RecipeComponent
        fields = "__all__"
