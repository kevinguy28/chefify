"""
URL configuration for the Django backend.

Includes routes for:
- Authentication (login, logout, register, Google login)
- User profile actions
- Recipe creation, reading, updating, deleting
- Steps, ingredients, and components
- Reviews and timeline views
"""

from django.urls import path

from .views import (
    CustomRefreshTokenView,
    CustomTokenObtainPairView,
    RecipeComponentView,
    RecipeIngredientView,
    ReviewView,
    StepView,
    UserProfileFriendView,
    UserProfileIngredientView,
    create_ingredient,
    create_recipe,
    create_recipe_step,
    delete_recipe,
    delete_recipe_component,
    delete_recipe_ingredient,
    get_friends_user_profile,
    get_query_user_profile,
    get_recipe_ingredient,
    get_user_profile_favourite_recipe,
    google_login,
    is_authenticated,
    logout,
    post_user_name,
    read_cuisines,
    read_recipe,
    read_recipe_steps,
    read_recipes,
    read_recipes_timeline,
    register,
    update_favourite_user_profile,
    update_recipe,
    update_recipe_step_order,
    update_review_likes,
    user_profile_ingredient_move,
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
    path("recipe/read/<int:recipeId>/", read_recipe),
    path("recipe/create/", create_recipe),
    path("recipe/update/<int:recipeId>/", update_recipe),
    path("recipe/delete/<int:recipeId>/", delete_recipe),
    # Recipe Step Endpoints
    path("recipe/step/order/<int:stepId>/", update_recipe_step_order),
    path("recipe/<int:recipeId>/step/", create_recipe_step),
    path("recipe/step/<int:stepId>/", StepView.as_view()),
    # Recipe Steps Endpoints
    path("steps/recipe/read/<int:recipeId>/", read_recipe_steps),
    # Reviews
    path("recipe/<int:recipeId>/review/", ReviewView.as_view()),
    path("review/<int:reviewId>/", update_review_likes),
    # Ingredients
    path("ingredient/", create_ingredient),
    # User Profie
    path("user-profile/", UserProfileFriendView.as_view()),
    path("user-profile/query/", get_query_user_profile),
    path("user-profile/favourite/<int:recipeId>/", update_favourite_user_profile),
    path("user-profile/friends/", get_friends_user_profile),
    path("user-profile/ingredient/", UserProfileIngredientView.as_view()),
    path("user-profile/ingredient/move/", user_profile_ingredient_move),
    path("user-profile/favourite/", get_user_profile_favourite_recipe),
    # Recipe Ingredient
    path("recipe/ingredient/", RecipeIngredientView.as_view()),
    path("recipe/<int:recipeId>/ingredient/", get_recipe_ingredient),
    path("recipe/ingredient/<int:ingredientId>/", delete_recipe_ingredient),
    # Recipe Component
    path("recipe/<int:recipeId>/component/", RecipeComponentView.as_view()),
    path("recipe/component/<int:componentId>/", delete_recipe_component),
    path("register/", register),
]
