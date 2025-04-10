import json
import nltk
from django.db.models import Q, Count, F
from django.shortcuts import render
from django.core.paginator import Paginator
from django.contrib.auth.models import User
from .models import Recipe, RecipeSteps, Review, Ingredient, UserProfile, RecipeIngredient, RecipeComponent
from .serializer import UserRegistrationSerializer, UserSerializer, CuisineSerializer, RecipeSerializer, RecipeStepsSerializer, ReviewSerializer, UserProfileIngredientListSerializer, IngredientSerializer, RecipeIngredientSerializer, RecipeComponentSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .models import Recipe, Cuisine

from .functions import capitalize

import nltk
# nltk.download('wordnet')
from nltk.stem import WordNetLemmatizer
lemmatizer = WordNetLemmatizer()

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

    pageNumber = request.GET.get("page", 1)
    needUser = request.GET.get("needUser")
    privacy = request.GET.get("privacy")
    filterInput = request.GET.get("filterInput") 
    cuisine = Cuisine.objects.get(name=request.GET.get("cuisine")) if request.GET.get("cuisine") else None
    
    filters = Q()

    if needUser == "true":
        filters &= Q(user=request.user)
    if filterInput:
        filters &= Q(name__icontains=filterInput)
    if privacy:
        filters &= Q(privacy__icontains=privacy)
    if cuisine:
        filters &= Q(cuisine=cuisine)

    recipes = Recipe.objects.filter(filters)
    paginator = Paginator(recipes, 6)
    page_obj = paginator.get_page(pageNumber)
    serializer = RecipeSerializer(page_obj, many=True)

    return Response({
        "recipes": serializer.data,
        "page": page_obj.number,  # Current page
        "totalPages": paginator.num_pages,  # Total number of pages
        "hasNext": page_obj.has_next(),  # If there's a next page
        "hasPrevious": page_obj.has_previous()  # If there's a previous page
    })


# ----- Recipe -----


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def readRecipe(request, recipeId):
    try:
        recipe = Recipe.objects.get(id=recipeId)
        serializer = RecipeSerializer(recipe)
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
        return Response(
            {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
        )
    
class StepView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, stepId):
        try:
            try:
                step = RecipeSteps.objects.get(id=stepId)
            except Exception as e:
                return Response(
                    {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_404_NOT_FOUND
                )
            
            data = request.data
            if(data['title']):
                step.title = data['title']
            if(data['description']):
                step.description = data['description']

            step.save()
            return Response({"success": True})
        except Exception as e:
            return Response({"error": f"An error occured: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request, stepId):
        try:
            step = RecipeSteps.objects.get(id=stepId)
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
    
# ----- Review -----

class ReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, recipeId):
        try:
            recipe = Recipe.objects.get(id=recipeId)
            data = request.data
            if(data['rating'] and data['rating'] != 0):
                rating = data['rating']
                try: 
                    review_text = data['review_text']
                    review = Review.objects.create(recipe=recipe, rating=rating, review_text=review_text, user=request.user)
                except:
                    review = Review.objects.create(recipe=recipe, rating=rating, review_text=None, user=request.user)
                serializer = ReviewSerializer(review)
                return Response(serializer.data, status=201)
            return Response({"success": True})
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )

    def get(self, request, recipeId):
        if(request.GET.get("reviewAll") == "false"):
            try:
                recipe = Recipe.objects.get(id=recipeId)
                try:
                    review = Review.objects.filter(recipe=recipe).get(user=request.user)
                except Exception as e:
                    return Response(None, status=status.HTTP_200_OK)
                serializer = ReviewSerializer(review)
                return Response(serializer.data, status = 200)
            except Exception as e:
                return Response(
                    {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
                )
        elif(request.GET.get("reviewAll") == "true"):
            recipe = Recipe.objects.get(id=recipeId)
            try:
                reviews = Review.objects.filter(recipe=recipe)

                # Apply ordering based on query parameters
                order_params = []

                # Check if "relevant" is true and add it to the order parameters
                if request.GET.get("relevant") == "true":  # Fixed the condition here
                    print("rel")
                    reviews = reviews.annotate(
                        liked_count=Count('likedBy'),
                        disliked_count=Count('dislikedBy'),
                        like_dislike_diff=F('liked_count') - F('disliked_count')
                    )
                    # Order by the biggest difference between likes and dislikes (descending)
                    order_params.append("-like_dislike_diff")
                    order_params.append("-liked_count")

                if request.GET.get("newest") == "true":
                    print("new")
                    order_params.append("-updated")

                # Check if "oldest" is true and add it to the order parameters
                if request.GET.get("oldest") == "true":
                    print("oldest")
                    order_params.append("updated")

                # Check if "highest" is true and add it to the order parameters
                if request.GET.get("highest") == "true":
                    print("highest")
                    order_params.append("-rating")

                # Check if "lowest" is true and add it to the order parameters
                if request.GET.get("lowest") == "true":
                    print("lowest")
                    order_params.append("rating")

                # Apply the ordering to the queryset if there are any order parameters
                if order_params:
                    reviews = reviews.order_by(*order_params)

                pageNumber = request.GET.get("page", 1)
                paginator = Paginator(reviews, 2)
                page_obj = paginator.get_page(pageNumber)
            except Exception as e:
                return Response(None, status=status.HTTP_200_OK)

            serializer = ReviewSerializer(page_obj, many=True)
            print(serializer.data)
            return Response({
                "reviews": serializer.data,
                "page": page_obj.number,
                "totalPages": paginator.num_pages,  # Total number of pages
                "hasNext": page_obj.has_next(),  # If there's a next page
                "hasPrevious": page_obj.has_previous()  # If there's a previous page

            })

    def put(self, request, recipeId):
        data = request.data
        try:
            review = Review.objects.get(user=request.user, recipe=Recipe.objects.get(id=recipeId))
            if(data['rating'] != review.rating):
                review.rating = data['rating']
            if(data['review_text'] != review.review_text):
                review.review_text = data['review_text']
            review.save()
            serializer = ReviewSerializer(review)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )
        
    def delete(self, request, recipeId):
        try:
            review = Review.objects.get(user=request.user, recipe=Recipe.objects.get(id=recipeId))
            if(review):
                review.delete()
                return(Response({"Success": "Review has been deleted"}))
            return Response(
                {"error": f"Review could not be found"}, status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )
        
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateReviewLikes(request, reviewId):
    review = Review.objects.get(id=reviewId)
    isLike = request.data['isLike']
    if(isLike):
        if(request.user in review.likedBy.all()):
            review.likedBy.remove(request.user)
        else:
            review.likedBy.add(request.user)
            if(request.user in review.dislikedBy.all()):
                review.dislikedBy.remove(request.user)
    else:
        if(request.user in review.dislikedBy.all()):
            review.dislikedBy.remove(request.user)
        else:
            review.dislikedBy.add(request.user)
            if(request.user in review.likedBy.all()):
                review.likedBy.remove(request.user)
    review.save()
    serializer = ReviewSerializer(review)
    return Response(serializer.data, status=200)

# Ingredient

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createIngredient(request):
    name = request.data['name'].lower()
    if not (Ingredient.objects.filter(name=name)):
        Ingredient.objects.create(name=name).save

    return Response({"success": True})

# User Profile - Favourite Recipes

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def updateFavouriteUserProfile(request, recipeId):
      userProfile = UserProfile.objects.get(user=request.user)
      recipe = Recipe.objects.get(id=recipeId)
      userProfile.favouriteRecipes.add(recipe)
      userProfile.save()

      return Response({"success":True}, status=200)

# User Profile - Ingredient

class UserProfileIngredientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        is_owned = request.GET.get('isOwned')
        if(is_owned == "true"):
            user_profile = user_profile.ownedIngredients
        else:
            user_profile = user_profile.buyIngredients

        categories = {
            "dairy": user_profile.filter(ingredientType="dairy"),
            "fruitsVegetables": user_profile.filter(ingredientType="fruitsVegetables"),
            "grains": user_profile.filter(ingredientType="grains"),
            "herbsSpices": user_profile.filter(ingredientType="herbsSpices"),
            "protein": user_profile.filter(ingredientType="protein"),
            "other": user_profile.filter(ingredientType="other"),
        }

        # Serialize each category and format as list of dictionaries
        serialized_data = [
            {category: IngredientSerializer(ingredients, many=True).data}
            for category, ingredients in categories.items()
        ]

        return Response(serialized_data, status=status.HTTP_200_OK)

    def patch(self, request):
        user = request.user
        userProfile = UserProfile.objects.get(user=user)
        is_owned = str(request.data.get('isOwned')).lower() == "true"
        try:
            ingredient = Ingredient.objects.get(name=request.data.get('ingredient'), ingredientType=request.data.get('ingredientType'))
        except Ingredient.DoesNotExist:
            ingredient = Ingredient.objects.create(name=capitalize(request.data.get('ingredient').lower()), ingredientType=request.data.get('ingredientType'))
            
        if is_owned:
            userProfile.ownedIngredients.add(ingredient)
        else:
            userProfile.buyIngredients.add(ingredient)

        return Response({"success": True})
    
    def delete(self, request):
        user = request.user
        userProfile = UserProfile.objects.get(user=user)
        userProfileIngredientList = userProfile.ownedIngredients if request.data.get('isOwned') == "true" else userProfile.buyIngredients

        try:
            userProfileIngredientList.remove(Ingredient.objects.get(name=request.data.get('ingredient').lower()))
        except:
            userProfileIngredientList.remove(Ingredient.objects.get(id=request.data.get('id')))


        return Response({"success": True})
    
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def UserProfileIngredientMove(request):
    user = request.user
    userProfile = UserProfile.objects.get(user=user)
    ingredient = Ingredient.objects.get(id=request.data.get('id'))
    isOwned = request.data.get("isOwned")
    
    if(isOwned == "true"):
            userProfile.ownedIngredients.remove(ingredient)
            userProfile.buyIngredients.add(ingredient)
    else:
            userProfile.buyIngredients.remove(ingredient)
            userProfile.ownedIngredients.add(ingredient)

    return Response({"success": True})

# User Ingredient View

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRecipeIngredient(request, recipeId):
    recipe = Recipe.objects.get(id=recipeId)
    componentId = request.GET.get('componentId')
    recipeComponent = RecipeComponent.objects.get(id=componentId)
    recipeIngredient = RecipeIngredient.objects.filter(recipe=recipe, recipeComponent=recipeComponent)
    serializer = RecipeIngredientSerializer(recipeIngredient, many=True)
    return Response(serializer.data, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteRecipeIngredient(request, ingredientId):
    recipeIngredient = RecipeIngredient.objects.get(id=ingredientId)
    if(request.user == recipeIngredient.recipe.user):
        recipeIngredient.delete()
    return Response({"Success": True}, status=200)


class RecipeIngredientView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipeId = request.data.get('recipeId')
        if not(Recipe.objects.get(id=recipeId).user == request.user):
           return Response({"error": "You are not authorized to modify this recipe."}, status=403)
        recipe = Recipe.objects.get(id=recipeId)

        ingredientName = request.data.get("ingredient")
        ingredientType = request.data.get("ingredientType")

        quantity = request.data.get('quantity')

        if(quantity <= 0):
            return Response({"success": False})
        
        componentId = request.data.get('componentId')
        try:
            recipeComponent = RecipeComponent.objects.get(id=componentId)
        except RecipeComponent.DoesNotExist:
            return Response({"success": False})
        
        try: 
            ingredient = Ingredient.objects.get(name=ingredientName, ingredientType = ingredientType)
        except Ingredient.DoesNotExist:
            ingredient = Ingredient.objects.create(name=ingredientName, ingredientType=ingredientType)

        unit = request.data.get('unit')
        recipeIngredient = RecipeIngredient.objects.create(recipe=recipe, ingredient=ingredient, quantity=quantity, unit=unit, recipeComponent=recipeComponent)
        serializer = RecipeIngredientSerializer(recipeIngredient)
        return Response(serializer.data, status=200)
    
# Recipe Component

class RecipeComponentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, recipeId):
        recipe = Recipe.objects.get(id=recipeId)
        recipeComponent = RecipeComponent.objects.filter(recipe=recipe)
        serializer = RecipeComponentSerializer(recipeComponent, many=True)
        return Response(serializer.data, status=200)

    def post(self, request, recipeId):
        recipeComponentName = request.data['recipeComponentName']
        recipeComponentDesc = request.data['recipeComponentDescription']
        recipe = Recipe.objects.get(id=recipeId)
        recipeComponent = RecipeComponent.objects.create(name=recipeComponentName, description=recipeComponentDesc,recipe=recipe)
        serializer = RecipeComponentSerializer(recipeComponent)

        return Response(serializer.data, status=200)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteRecipeComponent(request, componentId):
    user = request.user
    recipeComponent = RecipeComponent.objects.get(id=componentId)
    if(recipeComponent.recipe.user == user):
        recipeComponent.delete()
    return Response({"success": True})