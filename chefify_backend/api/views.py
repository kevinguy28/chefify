"""Views for function"""

# pylint: disable=no-member

from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.core.exceptions import FieldError
from django.core.paginator import Paginator
from django.db import DatabaseError
from django.db.models import Count, F, Q
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import auth as firebase_auth
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .functions import capitalize
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
from .serializer import (
    CuisineSerializer,
    IngredientSerializer,
    RecipeComponentSerializer,
    RecipeIngredientSerializer,
    RecipeSerializer,
    RecipeStepsSerializer,
    ReviewSerializer,
    UserProfileSerializer,
    UserRegistrationSerializer,
    UserSerializer,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom view to obtain JWT token pair and set them as secure HttpOnly cookies."""

    def post(self, request, *args, **kwargs):
        """Handle POST request, set JWT tokens in cookies, and return success response.

        Returns:
            Response: DRF Response with success status.
        """
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens.get("access")
            refresh_token = tokens.get("refresh")

            res = Response({"success": True})

            # Set HttpOnly, Secure cookies for tokens
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

        except (KeyError, AttributeError, TypeError):
            return Response({"success": False}, status=400)


class CustomRefreshTokenView(TokenRefreshView):
    """Custom view to refresh JWT access token and set it as secure HttpOnly cookies."""

    def post(self, request, *args, **kwargs):
        """Handle POST request, set JWT tokens in cookies, and return success response.

        Returns:
            Response: DRF Response with success status.
        """
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"refreshed": False}, status=status.HTTP_401_UNAUTHORIZED)
        request.data["refresh"] = refresh_token
        response = super().post(request, *args, **kwargs)

        # If refresh failed, super().post() returns error status
        if response.status_code != status.HTTP_200_OK:
            return Response({"refreshed": False}, status=response.status_code)

        tokens = response.data
        access_token = tokens.get("access")
        res = Response({"refreshed": True})

        # Set the new access_token cookie
        res.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="None",
            path="/",
        )
        return res


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    """Logins user and returns response and sets JWT token pair as secure HttpOnly cookies."""
    token = request.data.get("idToken")
    print(token)
    if not token:
        return Response(
            {"error": "No token provided"}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        # 1. Verify the Firebase token
        decoded_token = firebase_auth.verify_id_token(token)
        print(decoded_token)
        email = decoded_token.get("email")
        name = decoded_token.get("name", "")
        first_name, last_name = "", ""
        photo_url = decoded_token.get("picture", "")
        if name:
            parts = name.strip().split()
            first_name = parts[0]
            last_name = " ".join(parts[1:]) if len(parts) > 1 else ""

        # 2. Get or create user
        user, _ = User.objects.get_or_create(
            email=email,
            defaults={
                "username": email.split("@")[0],
                "first_name": first_name,
                "last_name": last_name,
            },
        )

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.profilePictureUrl = photo_url
        profile.save()

        # 3. Generate access/refresh tokens like your existing JWT login
        print("gen")
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        print(access_token)
        res = Response({"success": True})

        # 4. Set them as cookies (match your existing logic)
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
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="None",
            path="/",
        )

        print("✅ Google login success", user)

        return res

    except (KeyError, AttributeError, TypeError) as e:
        print("Google Auth Error:", e)
        return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
@permission_classes([AllowAny])  # Optional, if logout doesn't require auth
def logout():
    """Logout user and delete cookies."""
    response = Response({"detail": "Logout successful."}, status=status.HTTP_200_OK)
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return response


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """Register new user and return user data."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    """Authenticates user and returns user information."""
    print("✅ User is authenticated")
    user = request.user
    print("User:", user)

    serializer = UserSerializer(user)

    return Response({"authenticated": True, "user": serializer.data}, status=200)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def post_user_name(request):
    """Updates User name attribute and return response."""

    user = request.user
    first_name = request.data.get("firstName")
    last_name = request.data.get("lastName")
    username = request.data.get("username")

    if not all([first_name, last_name, username]):
        return Response({"error": "Missing fields."}, status=400)

    user.first_name = first_name
    user.last_name = last_name
    user.username = username
    user.save()

    print("✅ User updated!")
    return Response({"success": True}, status=200)


# ----- Cuisines -----


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def read_cuisines(_request):
    """Retrieves cuisines and return cuisines."""
    cuisines = Cuisine.objects.all().order_by("name")
    serializer = CuisineSerializer(cuisines, many=True)
    return Response(serializer.data)


# ----- Recipes -----


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def read_recipes(request):
    """Retrieves recipes given fitler and return list of recipes."""
    page_number = request.GET.get("page", 1)
    need_user = request.GET.get("needUser")
    privacy = request.GET.get("privacy")
    filter_input = request.GET.get("filterInput")
    recent = request.GET.get("recent")
    cuisine = (
        Cuisine.objects.filter(name=request.GET.get("cuisine")).first()
        if request.GET.get("cuisine")
        else None
    )

    filters = Q()

    if need_user == "true":
        filters &= Q(user=request.user)
    if filter_input:
        filters &= Q(name__icontains=filter_input)
    if privacy:
        filters &= Q(privacy=privacy)
    if cuisine:
        filters &= Q(cuisine=cuisine)

    if recent == "true":
        recipes = Recipe.objects.filter(filters).order_by("-created")
    else:
        recipes = Recipe.objects.filter(filters).order_by("created")

    return_quantity = request.GET.get("returnQuantity")

    paginator = (
        Paginator(recipes, return_quantity)
        if return_quantity
        else Paginator(recipes, 10)
    )

    page_obj = paginator.get_page(page_number)
    serializer = RecipeSerializer(page_obj, many=True)
    return Response(
        {
            "recipes": serializer.data,
            "page": page_obj.number,  # Current page
            "totalPages": paginator.num_pages,  # Total number of pages
            "hasNext": page_obj.has_next(),  # If there's a next page
            "hasPrevious": page_obj.has_previous(),  # If there's a previous page
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def read_recipes_timeline(request):
    """Get recipes from user's friendslist, returns recipe data."""
    page_number = request.GET.get("page", 1)
    friends_list = UserProfile.objects.get(user=request.user).friendsList.all()
    recipe_list = []
    for friend in friends_list:
        user_recipes = (
            Recipe.objects.filter(user=friend)
            .exclude(privacy="private")
            .order_by("-updated")
        )
    recipe_list.extend(user_recipes)
    paginator = Paginator(recipe_list, 3)
    main_page = paginator.get_page(page_number)
    serializer = RecipeSerializer(main_page, many=True)
    return Response(
        {
            "recipes": serializer.data,
            "page": main_page.number,  # Current page
            "totalPages": paginator.num_pages,  # Total number of pages
            "hasNext": main_page.has_next(),  # If there's a next page
            "hasPrevious": main_page.has_previous(),  # If there's a previous page
        }
    )


# ----- Recipe -----


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def read_recipe(_request, recipe_id):
    """Returns recipe."""
    try:
        recipe = Recipe.objects.get(id=recipe_id)
        serializer = RecipeSerializer(recipe)
        return Response(serializer.data)
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_recipe(request):
    """Creates a recipe object and returns recipe data is successful."""
    recipe_name = request.data.get("recipeName")
    cuisine = Cuisine.objects.get(name=request.data.get("cuisine"))
    recipe = Recipe.objects.create(name=recipe_name, cuisine=cuisine, user=request.user)
    serializer = RecipeSerializer(recipe)
    return Response(serializer.data, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_recipe(request, recipe_id):
    """Updates recipe information, returns recipe."""
    try:
        recipe = Recipe.objects.get(id=recipe_id)
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)

    cuisine = request.data.get("recipeCuisine", recipe.cuisine)
    cuisine = Cuisine.objects.get(name=cuisine)
    name = request.data.get("recipeName", recipe.name)
    privacy = request.data.get("recipePrivacy", recipe.privacy)
    description = request.data.get("recipeDescription", recipe.description)
    # image = request.FILES.get("recipeImage")
    recipe_image_url = request.data.get("recipeImageUrl", recipe.recipeImageUrl)
    recipe.name = name
    recipe.cuisine = cuisine
    recipe.privacy = privacy
    recipe.description = description
    recipe.recipeImageUrl = recipe_image_url

    # if image:
    #     recipe.image = image

    recipe.save()

    serializer = RecipeSerializer(recipe)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_recipe(request, recipe_id):
    """Delete recipe on recipe_id, return response success."""
    try:
        recipe = Recipe.objects.get(id=recipe_id)

        if recipe.user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

        recipe.delete()
        return Response({"success": True}, status=status.HTTP_200_OK)
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)


# ----- Recipe Step -----


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_recipe_step(request, recipe_id):
    """Create RecipeSteps object given fields, return RecipeSteps data."""
    try:
        recipe = Recipe.objects.get(id=recipe_id)
    except Recipe.DoesNotExist:
        return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
    step_title = request.data["stepTitle"]
    step_description = request.data["stepDescription"]
    step = RecipeSteps.objects.create(
        recipe=recipe, title=step_title, description=step_description
    )
    step.save()
    serializer = RecipeStepsSerializer(step)
    return Response(serializer.data, status=201)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_recipe_step_order(request, step_id):
    """Swap order field value of Step of Recipe, return success."""
    move_down = request.data.get("moveDown")
    step = RecipeSteps.objects.get(id=step_id)
    recipe_steps = step.recipe.steps.all()
    tmp = step.order
    if move_down:
        higher_order_step = recipe_steps.filter(order__gt=step.order).first()
        if higher_order_step:
            # Swap the order of the two steps
            step.order = higher_order_step.order
            higher_order_step.order = tmp

            # Save both steps after swapping
            step.save()
            higher_order_step.save()
    else:
        lower_order_step = recipe_steps.filter(order__lt=step.order).last()
        if lower_order_step:
            step.order = lower_order_step.order
            lower_order_step.order = tmp

            # Save both steps after swapping
            step.save()
            lower_order_step.save()
    return Response({"success": True})


class StepView(APIView):
    """Custom View for Step to handle PATCH & DELETE."""

    permission_classes = [IsAuthenticated]

    def patch(self, request, step_id):
        """Update field values of Step, return success."""
        try:
            step = RecipeSteps.objects.get(id=step_id)
        except RecipeSteps.DoesNotExist as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = request.data
        if data["title"]:
            step.title = data["title"]
        if data["description"]:
            step.description = data["description"]

        step.save()
        return Response({"success": True})

    def delete(self, _request, step_id):
        """Delete instance of Step object, return success."""
        try:
            step = RecipeSteps.objects.get(id=step_id)
            step.delete()
            return Response(
                {"success": "Recipe step deleted successfully"},
                status=status.HTTP_200_OK,
            )
        except RecipeSteps.DoesNotExist as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# ----- Recipe Steps -----


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def read_recipe_steps(_request, recipe_id):
    """Retreive recipe steps associated with a recipe, return steps data."""
    try:
        recipe = Recipe.objects.get(id=recipe_id)
        steps = recipe.steps.all()
        serializer = RecipeStepsSerializer(steps, many=True)
        return Response(serializer.data, status=200)
    except Recipe.DoesNotExist as e:
        return Response(
            {"error": f"An error occurred: {str(e)}"},
            status=status.HTTP_400_BAD_REQUEST,
        )


# ----- Review -----


class ReviewView(APIView):
    """Custom view for Review to handle POST & GET."""

    permission_classes = [IsAuthenticated]

    def post(self, request, recipe_id):
        """Create review, return review data."""
        try:
            recipe = Recipe.objects.get(id=recipe_id)
            user_profile = UserProfile.objects.get(user=request.user)
            data = request.data
            if data["rating"] and data["rating"] != 0:
                rating = data["rating"]
                review_text = data["review_text"]
                review = Review.objects.create(
                    recipe=recipe,
                    rating=rating,
                    review_text=review_text,
                    user=request.user,
                    userProfile=user_profile,
                )
                serializer = ReviewSerializer(review)
                return Response(serializer.data, status=201)
            return Response({"success": True})
        except (UserProfile.DoesNotExist, Recipe.DoesNotExist) as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def get(self, request, recipe_id):
        """Get all Review instances associated with a Recipe and return review data."""
        if request.GET.get("reviewAll") == "false":
            try:
                recipe = Recipe.objects.get(id=recipe_id)
                try:
                    review = Review.objects.filter(
                        recipe=recipe, user=request.user
                    ).first()
                except Review.DoesNotExist:
                    return Response(None, status=status.HTTP_200_OK)
                serializer = ReviewSerializer(review)
                return Response(serializer.data, status=200)
            except Recipe.DoesNotExist as e:
                return Response(
                    {"error": f"An error occurred: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        elif request.GET.get("reviewAll") == "true":
            recipe = Recipe.objects.get(id=recipe_id)
            try:
                reviews = Review.objects.filter(recipe=recipe)

                # Apply ordering based on query parameters
                order_params = []

                if request.GET.get("relevant") == "true":
                    reviews = reviews.annotate(
                        liked_count=Count("likedBy"),
                        disliked_count=Count("dislikedBy"),
                        like_dislike_diff=F("liked_count") - F("disliked_count"),
                    )
                    order_params.append("-like_dislike_diff")
                    order_params.append("-liked_count")

                if request.GET.get("newest") == "true":
                    order_params.append("-updated")

                if request.GET.get("oldest") == "true":
                    order_params.append("updated")

                if request.GET.get("highest") == "true":
                    order_params.append("-rating")

                if request.GET.get("lowest") == "true":
                    order_params.append("rating")

                if order_params:
                    reviews = reviews.order_by(*order_params)

                page_number = request.GET.get("page", 1)
                paginator = Paginator(reviews, 2)
                page_obj = paginator.get_page(page_number)
            except (ValueError, FieldError, DatabaseError) as e:
                return Response({}, status=status.HTTP_200_OK)

            serializer = ReviewSerializer(page_obj, many=True)
            return Response(
                {
                    "reviews": serializer.data,
                    "page": page_obj.number,
                    "totalPages": paginator.num_pages,  # Total number of pages
                    "hasNext": page_obj.has_next(),  # If there's a next page
                    "hasPrevious": page_obj.has_previous(),  # If there's a previous page
                }
            )

    def put(self, request, recipeId):
        data = request.data
        try:
            review = Review.objects.get(
                user=request.user, recipe=Recipe.objects.get(id=recipeId)
            )
            if data["rating"] != review.rating:
                review.rating = data["rating"]
            if data["review_text"] != review.review_text:
                review.review_text = data["review_text"]
            review.save()
            serializer = ReviewSerializer(review)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, recipeId):
        try:
            review = Review.objects.get(
                user=request.user, recipe=Recipe.objects.get(id=recipeId)
            )
            if review:
                review.delete()
                return Response({"Success": "Review has been deleted"})
            return Response(
                {"error": f"Review could not be found"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def updateReviewLikes(request, reviewId):
    review = Review.objects.get(id=reviewId)
    isLike = request.data["isLike"]
    if isLike:
        if request.user in review.likedBy.all():
            review.likedBy.remove(request.user)
        else:
            review.likedBy.add(request.user)
            if request.user in review.dislikedBy.all():
                review.dislikedBy.remove(request.user)
    else:
        if request.user in review.dislikedBy.all():
            review.dislikedBy.remove(request.user)
        else:
            review.dislikedBy.add(request.user)
            if request.user in review.likedBy.all():
                review.likedBy.remove(request.user)
    review.save()
    serializer = ReviewSerializer(review)
    return Response(serializer.data, status=200)


# Ingredient


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createIngredient(request):
    name = request.data["name"].lower()
    if not (Ingredient.objects.filter(name=name)):
        Ingredient.objects.create(name=name).save

    return Response({"success": True})


# User Profile


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserProfileFavouriteRecipe(request):
    print("gayt")
    page = request.GET.get("page", 1)
    print(page)
    userProfile = UserProfile.objects.get(user=request.user).favouriteRecipes.all()
    print(userProfile)
    paginator = Paginator(userProfile, 12)
    page_obj = paginator.get_page(int(page))
    serializer = RecipeSerializer(page_obj, many=True)
    return Response(
        {
            "recipes": serializer.data,
            "page": page_obj.number,
            "totalPages": paginator.num_pages,
            "hasNext": page_obj.has_next(),
            "hasPrevious": page_obj.has_previous(),
        }
    )


class UserProfileFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        userProfile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(userProfile)
        return Response(serializer.data, status=200)

    def patch(self, request):
        userProfile = UserProfile.objects.get(user=request.user)
        if request.data["action"] == "add":
            userProfileId = request.data["userProfileId"]
            userRemove = UserProfile.objects.get(id=userProfileId)
            userProfile.friendsList.add(userRemove.user)
            userProfile.save()
        elif request.data["action"] == "remove":
            userProfileId = request.data["userProfileId"]
            userRemove = UserProfile.objects.get(id=userProfileId)
            userProfile.friendsList.remove(userRemove.user)
            userProfile.save()
        return Response({"Success": True}, status=200)


# User Profile - Friends


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getFriendsUserProfile(request):
    userProfile = UserProfile.objects.get(user=request.user)
    friendsProfile = []
    for user in userProfile.friendsList.all():
        friendsProfile.append(user.profile)
    serializer = UserProfileSerializer(friendsProfile, many=True)
    return Response(serializer.data, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getQueryUserProfile(request):
    userFriendList = UserProfile.objects.get(user=request.user).friendsList.all()
    usernameQuery = request.GET.get("usernameQuery")
    user_profiles = UserProfile.objects.filter(user__username__icontains=usernameQuery)

    friend_user_ids = [user.id for user in userFriendList]

    user_profiles = user_profiles.exclude(user__id__in=friend_user_ids).exclude(
        user_id=request.user.id
    )

    serializer = UserProfileSerializer(user_profiles, many=True)
    # print(serializer.data)
    return Response(serializer.data, status=200)


# User Profile - Favourite Recipes


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def updateFavouriteUserProfile(request, recipeId):
    userProfile = UserProfile.objects.get(user=request.user)
    recipe = Recipe.objects.get(id=recipeId)
    isFavourited = request.data["isFavourite"]
    if isFavourited == "true":
        userProfile.favouriteRecipes.remove(recipe)
    else:
        userProfile.favouriteRecipes.add(recipe)
    userProfile.save()
    return Response({"success": True}, status=200)


# User Profile - Ingredient


class UserProfileIngredientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        is_owned = request.GET.get("isOwned")
        if is_owned == "true":
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
        is_owned = str(request.data.get("isOwned")).lower() == "true"
        try:
            ingredient = Ingredient.objects.get(
                name=request.data.get("ingredient"),
                ingredientType=request.data.get("ingredientType"),
            )
        except Ingredient.DoesNotExist:
            ingredient = Ingredient.objects.create(
                name=capitalize(request.data.get("ingredient").lower()),
                ingredientType=request.data.get("ingredientType"),
            )

        if is_owned:
            userProfile.ownedIngredients.add(ingredient)
        else:
            userProfile.buyIngredients.add(ingredient)

        return Response({"success": True})

    def delete(self, request):
        user = request.user
        userProfile = UserProfile.objects.get(user=user)
        userProfileIngredientList = (
            userProfile.ownedIngredients
            if request.data.get("isOwned") == "true"
            else userProfile.buyIngredients
        )

        try:
            userProfileIngredientList.remove(
                Ingredient.objects.get(name=request.data.get("ingredient").lower())
            )
        except:
            userProfileIngredientList.remove(
                Ingredient.objects.get(id=request.data.get("id"))
            )

        return Response({"success": True})


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def UserProfileIngredientMove(request):
    user = request.user
    userProfile = UserProfile.objects.get(user=user)
    ingredient = Ingredient.objects.get(id=request.data.get("id"))
    isOwned = request.data.get("isOwned")

    if isOwned == "true":
        userProfile.ownedIngredients.remove(ingredient)
        userProfile.buyIngredients.add(ingredient)
    else:
        userProfile.buyIngredients.remove(ingredient)
        userProfile.ownedIngredients.add(ingredient)

    return Response({"success": True})


# User Ingredient View


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getRecipeIngredient(request, recipeId):
    recipe = Recipe.objects.get(id=recipeId)
    componentId = request.GET.get("componentId")
    recipeComponent = RecipeComponent.objects.get(id=componentId)
    recipeIngredient = RecipeIngredient.objects.filter(
        recipe=recipe, recipeComponent=recipeComponent
    )
    serializer = RecipeIngredientSerializer(recipeIngredient, many=True)
    return Response(serializer.data, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deleteRecipeIngredient(request, ingredientId):
    recipeIngredient = RecipeIngredient.objects.get(id=ingredientId)
    if request.user == recipeIngredient.recipe.user:
        recipeIngredient.delete()
    return Response({"Success": True}, status=200)


class RecipeIngredientView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipeId = request.data.get("recipeId")
        if not (Recipe.objects.get(id=recipeId).user == request.user):
            return Response(
                {"error": "You are not authorized to modify this recipe."}, status=403
            )
        recipe = Recipe.objects.get(id=recipeId)

        ingredientName = request.data.get("ingredient")
        ingredientType = request.data.get("ingredientType")

        quantity = request.data.get("quantity")

        if quantity <= 0:
            return Response({"success": False})

        componentId = request.data.get("componentId")
        try:
            recipeComponent = RecipeComponent.objects.get(id=componentId)
        except RecipeComponent.DoesNotExist:
            return Response({"success": False})

        try:
            ingredient = Ingredient.objects.get(
                name=ingredientName, ingredientType=ingredientType
            )
        except Ingredient.DoesNotExist:
            ingredient = Ingredient.objects.create(
                name=ingredientName, ingredientType=ingredientType
            )

        unit = request.data.get("unit")
        recipeIngredient = RecipeIngredient.objects.create(
            recipe=recipe,
            ingredient=ingredient,
            quantity=quantity,
            unit=unit,
            recipeComponent=recipeComponent,
        )
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
        recipeComponentName = request.data["recipeComponentName"]
        recipeComponentDesc = request.data["recipeComponentDescription"]
        recipe = Recipe.objects.get(id=recipeId)
        recipeComponent = RecipeComponent.objects.create(
            name=recipeComponentName, description=recipeComponentDesc, recipe=recipe
        )
        serializer = RecipeComponentSerializer(recipeComponent)

        return Response(serializer.data, status=200)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deleteRecipeComponent(request, componentId):
    user = request.user
    recipeComponent = RecipeComponent.objects.get(id=componentId)
    if recipeComponent.recipe.user == user:
        recipeComponent.delete()
    return Response({"success": True})
