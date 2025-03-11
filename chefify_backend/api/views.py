import json
from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Recipe, RecipeSteps
from .serializer import UserRegistrationSerializer, UserSerializer, CuisineSerializer, RecipeSerializer, RecipeStepsSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
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

            access_token = tokens["access"]
            refresh_token = tokens["refresh"]
            res = Response()
            res.data = {"success": True}
            
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
                path="/",
            )

            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="None",
                path="/",
            )

            return res

        except:
            return Response({"success": False})


class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            request.data["refresh"] = refresh_token
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            access_token = tokens["access"]
            res = Response()
            res.data = {"refreshed": True}
            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="None",
                path="/",
            )

            return res
        except:
            return Response({"refreshed": False})


@api_view(["POST"])
def logout(request):
    try:
        res = Response()
        res.data = {"success": True}
        res.delete_cookie("access_token", path="/", samesite="None")
        res.delete_cookie("refresh_token", path="/", samesite="None")
        return res
    except:
        return Response({"success": False})


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.error)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    user = request.user
    return Response({
        "authenticated": True,
        "user": {
            "id": user.id,
            "username": user.username,
        }
    })

# ----- User -----
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def readUser(request):
    user = User.objects.get(user=request.user)
    serializer = UserSerializer(user)
    return Response(serializer.data)

# ----- Cuisines -----


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def readCuisines(request):
    cuisines = Cuisine.objects.all().order_by("name")
    serializer = CuisineSerializer(cuisines, many=True)
    return Response(serializer.data)


# ----- Recipes -----


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def readRecipes(request):
    user = request.user
    recipes = Recipe.objects.filter(user=user)
    serializer = RecipeSerializer(recipes, many=True)
    return Response(serializer.data)


# ----- Recipe -----


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def readRecipe(request, recipeId):
    try:
        print('hello')
        recipe = Recipe.objects.get(id=recipeId)
        print(recipe)
        serializer = RecipeSerializer(recipe)
        print(serializer.data)
        return Response(serializer.data)
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createRecipe(request):

    try:
        recipeName = request.data.get("recipeName")
        try:
            cuisine = Cuisine.objects.get(name=request.data.get("cuisine"))
            recipe = Recipe.objects.create(
                name=recipeName, cuisine=cuisine, user=request.user
            )
        except:
            recipe = Recipe.objects.create(name=recipeName, user=request.user)

        serializer = RecipeSerializer(recipe)
        return Response(serializer.data, status=201)
    except:
        return Response(
            {"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateRecipe(request, recipeId):
    try:
        try:
            recipe = Recipe.objects.get(id=recipeId)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

        cuisine = request.data.get("recipeCuisine", recipe.cuisine)
        cuisine = Cuisine.objects.get(name=cuisine)
        name = request.data.get("recipeName", recipe.name)
        privacy = request.data.get("recipePrivacy", recipe.privacy)
        description = request.data.get("recipeDescription", recipe.description)
        image = request.FILES.get("recipeImage")  

        recipe.name = name
        recipe.cuisine = cuisine
        recipe.privacy = privacy
        recipe.description = description

        if image:
            recipe.image = image

        recipe.save()
        
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        print("Failed attempt")
        return Response(
            {"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST
        )


# ----- Recipe Step -----

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createRecipeStep(request, recipeId):
    try:
        try:
            recipe = Recipe.objects.get(id=recipeId)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
        stepTitle = request.data["stepTitle"]
        stepDescription = request.data["stepDescription"]
        step = RecipeSteps.objects.create(recipe=recipe, title=stepTitle, description=stepDescription)
        step.save()
        serializer = RecipeStepsSerializer(step)
        return Response(serializer.data, status=201)
    except Exception as e:
        return Response(
            {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateRecipeStepOrder(request, stepId):
    try:
        moveDown = request.data.get('moveDown')
        step = RecipeSteps.objects.get(id=stepId)
        recipeSteps = step.recipe.steps.all()
        tmp = step.order
        if(moveDown):
            higherOrderStep = recipeSteps.filter(order__gt=step.order).first()
            print(higherOrderStep)
            if higherOrderStep:
                # Swap the order of the two steps
                step.order = higherOrderStep.order
                higherOrderStep.order = tmp
                
                # Save both steps after swapping
                step.save()
                higherOrderStep.save()
        else:
            lowerOrderStep = recipeSteps.filter(order__lt=step.order).last()
            if(lowerOrderStep):
                step.order = lowerOrderStep.order
                lowerOrderStep.order = tmp
                
                # Save both steps after swapping
                step.save()
                lowerOrderStep.save()
        return Response({"success": True})
    except Exception as e:
        print("gaggaga")
        return Response(
            {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
        )
        
    
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deleteRecipeStep(request, stepId):
    try:
        step = RecipeSteps.objects.get(id=stepId)
        print(step)
        step.delete()
        return Response({"success": "Recipe step deleted successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
        )
    
# ----- Recipe Steps -----

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def readRecipeSteps(request, recipeId):
    try:
        recipe = Recipe.objects.get(id=recipeId)
        steps = recipe.steps.all()
        serializer = RecipeStepsSerializer(steps, many=True)
        return Response(serializer.data, status = 200)
    except Exception as e:
        return Response(
            {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
        )