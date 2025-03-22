from django.urls import path
from .views import CustomTokenObtainPairView, CustomRefreshTokenView, logout, is_authenticated, readCuisines, readRecipes, readRecipe, createRecipe, updateRecipe, createRecipeStep, updateRecipeStepOrder, StepView, readRecipeSteps, ReviewView, register, createIngredient, updateUserProfile

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
    path('recipe/step/order/<int:stepId>/', updateRecipeStepOrder),
    path('recipe/<int:recipeId>/step/', createRecipeStep),
    path('recipe/step/<int:stepId>/', StepView.as_view()),

    # Recipe Steps Endpoints
    path('steps/recipe/read/<int:recipeId>/', readRecipeSteps),

    # Reviews

    path('recipe/<int:recipeId>/review/', ReviewView.as_view()),

    # Ingredients

    path('ingredient/', createIngredient),

    # User Profie
    
    path('user-profile/', updateUserProfile),

    path('register/', register),
]
