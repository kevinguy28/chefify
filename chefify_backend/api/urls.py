from django.http import JsonResponse
from django.urls import path

from .views import (
    CustomRefreshTokenView,
    CustomTokenObtainPairView,
    RecipeComponentView,
    RecipeIngredientView,
    ReviewView,
    StepView,
    UserProfileFriendView,
    UserProfileIngredientMove,
    UserProfileIngredientView,
    createIngredient,
    createRecipe,
    createRecipeStep,
    deleteRecipe,
    deleteRecipeComponent,
    deleteRecipeIngredient,
    getFriendsUserProfile,
    getQueryUserProfile,
    getRecipeIngredient,
    getUserProfileFavouriteRecipe,
    google_login,
    is_authenticated,
    logout,
    post_user_name,
    read_cuisines,
    read_recipes,
    read_recipes_timeline,
    readRecipe,
    readRecipeSteps,
    register,
    updateFavouriteUserProfile,
    updateRecipe,
    updateRecipeStepOrder,
    updateReviewLikes,
)

urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", CustomRefreshTokenView.as_view(), name="token_refresh"),
    path("google/", google_login),
    path("logout/", logout),
    path("authenticated/", is_authenticated),
    # User Endpoints
    path("user/name/", post_user_name),
    # Cuisine Endpoints
    path("cuisine/read/", read_cuisines),
    # Recipes Endpoints
    path("recipes/read/", read_recipes),
    path("recipes/timeline/", read_recipes_timeline),
    # Recipe Endpoints
    path("recipe/read/<int:recipeId>/", readRecipe),
    path("recipe/create/", createRecipe),
    path("recipe/update/<int:recipeId>/", updateRecipe),
    path("recipe/delete/<int:recipeId>/", deleteRecipe),
    # Recipe Step Endpoints
    path("recipe/step/order/<int:stepId>/", updateRecipeStepOrder),
    path("recipe/<int:recipeId>/step/", createRecipeStep),
    path("recipe/step/<int:stepId>/", StepView.as_view()),
    # Recipe Steps Endpoints
    path("steps/recipe/read/<int:recipeId>/", readRecipeSteps),
    # Reviews
    path("recipe/<int:recipeId>/review/", ReviewView.as_view()),
    path("review/<int:reviewId>/", updateReviewLikes),
    # Ingredients
    path("ingredient/", createIngredient),
    # User Profie
    path("user-profile/", UserProfileFriendView.as_view()),
    path("user-profile/query/", getQueryUserProfile),
    path("user-profile/favourite/<int:recipeId>/", updateFavouriteUserProfile),
    path("user-profile/friends/", getFriendsUserProfile),
    path("user-profile/ingredient/", UserProfileIngredientView.as_view()),
    path("user-profile/ingredient/move/", UserProfileIngredientMove),
    path("user-profile/favourite/", getUserProfileFavouriteRecipe),
    # Recipe Ingredient
    path("recipe/ingredient/", RecipeIngredientView.as_view()),
    path("recipe/<int:recipeId>/ingredient/", getRecipeIngredient),
    path("recipe/ingredient/<int:ingredientId>/", deleteRecipeIngredient),
    # Recipe Component
    path("recipe/<int:recipeId>/component/", RecipeComponentView.as_view()),
    path("recipe/component/<int:componentId>/", deleteRecipeComponent),
    path("register/", register),
]
