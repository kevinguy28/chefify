from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Recipe
from .serializer import CuisineSerializer, RecipeSerializer, UserRegistrationSerializer
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .models import Recipe, Cuisine

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens['access']
            refresh_token = tokens['refresh']

            res = Response()
            res.data = {'success': True}
            res.set_cookie(
                key="access_token",
                value= access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )

            res.set_cookie(
                key="refresh_token",
                value= refresh_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )

            return res

        except:
            return Response({'success': False})

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens['access']
            res = Response()
            res.data = ({'refreshed': True})
            res.set_cookie(
                key="access_token",
                value= access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/',
            )

            return res
        except:
            return Response({'refreshed': False})

@api_view(['POST'])
def logout(request):
    try:
        res = Response()
        res.data = {'success': True}
        res.delete_cookie('access_token', path='/', samesite='None')
        res.delete_cookie('refresh_token', path='/', samesite='None')
        return res
    except:
        return Response({'success': False})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.error)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    return Response({'authenticated': True})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cuisines(request):
    cuisines = Cuisine.objects.all().order_by('name')
    serializer = CuisineSerializer(cuisines, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes ([IsAuthenticated])
def get_recipes(request):
    user = request.user
    recipes = Recipe.objects.filter(user=user)
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_recipe(request):
    try:
        recipeName = request.data.get('recipeName')
        cuisine = request.data.get('cuisine')
        print(f"Received: {recipeName}, {cuisine}")
        if not cuisine or cuisine == "N/A":
            recipe = Recipe.objects.create(
                name=recipeName,
                user = request.user
            )
        else:
            recipe = Recipe.objects.create(
                name=recipeName,
                cuisine = cuisine,
                user = request.user
            )
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data, status=201)
    except:
        print("error")
        return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
