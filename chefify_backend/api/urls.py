from django.urls import path
from .views import CustomTokenObtainPairView, CustomRefreshTokenView, logout, is_authenticated, getCuisines, getRecipes, getRecipe, createRecipe, editRecipe, register

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout),
    path('authenticated/', is_authenticated),

    # Cuisine Endpoints
    path('cuisine/', getCuisines),

    # Recipes Endpoints
    path('recipes/', getRecipes),

    # Recipe Endpoints
    path('recipe/<int:recipeId>/', getRecipe),
    path('recipe/create/', createRecipe),
    path('recipe/edit/<int:recipeId>/', editRecipe),


    path('register/', register),
]
