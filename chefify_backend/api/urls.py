from django.urls import path
from .views import CustomTokenObtainPairView, CustomRefreshTokenView, logout, is_authenticated, readCuisines, readRecipes, readRecipe, createRecipe, updateRecipe, createRecipeStep, deleteRecipeStep, readRecipeSteps, register

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout),
    path('authenticated/', is_authenticated),

    # Cuisine Endpoints
    path('cuisine/read/', readCuisines),

    # Recipes Endpoints
    path('recipes/read/', readRecipes),

    # Recipe Endpoints
    path('recipe/read/<int:recipeId>/', readRecipe),
    path('recipe/create/', createRecipe),
    path('recipe/update/<int:recipeId>/', updateRecipe),

    # Recipe Step Endpoints
    path('step/recipe/create/<int:recipeId>/', createRecipeStep),
    path('step/recipe/delete/<int:stepId>/', deleteRecipeStep),

    # Recipe Steps Endpoints
    path('steps/recipe/read/<int:recipeId>/', readRecipeSteps),


    path('register/', register),
]
