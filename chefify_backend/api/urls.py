from django.urls import path
from .views import CustomTokenObtainPairView, CustomRefreshTokenView, logout, is_authenticated, readCuisines, readRecipes, readRecipe, createRecipe, updateRecipe, createRecipeStep, updateRecipeStepOrder, StepView, readRecipeSteps, ReviewView, register, createIngredient, UserProfileIngredientView, UserProfileIngredientMove, RecipeIngredientView, getRecipeIngredient, RecipeComponentView, deleteRecipeComponent, deleteRecipeIngredient, updateReviewLikes, updateFavouriteUserProfile, UserProfileFriendView, getFriendsUserProfile, getQueryUserProfile

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
    path('review/<int:reviewId>/', updateReviewLikes),

    # Ingredients

    path('ingredient/', createIngredient),

    # User Profie
    
    path('user-profile/', UserProfileFriendView.as_view()),
    path('user-profile/query/', getQueryUserProfile),
    path('user-profile/favourite/<int:recipeId>/', updateFavouriteUserProfile),
    path('user-profile/friends/', getFriendsUserProfile),
    path('user-profile/ingredient/', UserProfileIngredientView.as_view()),
    path('user-profile/ingredient/move/', UserProfileIngredientMove),
    
    # Recipe Ingredient

    path('recipe/ingredient/', RecipeIngredientView.as_view()),
    path('recipe/<int:recipeId>/ingredient/', getRecipeIngredient),
    path('recipe/ingredient/<int:ingredientId>/', deleteRecipeIngredient),
    
    # Recipe Component

    path('recipe/<int:recipeId>/component/', RecipeComponentView.as_view()),
    path('recipe/component/<int:componentId>/', deleteRecipeComponent),

    path('register/', register),
]
