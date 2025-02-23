from django.urls import path
from .views import CustomTokenObtainPairView, CustomRefreshTokenView, logout, is_authenticated, get_cuisines, get_recipes, create_recipes,register

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout),
    path('authenticated/', is_authenticated),

    # Cuisine Endpoints
    path('cuisine/', get_cuisines),

    # Recipe Endpoints
    path('recipes/', get_recipes),
    path('recipes/create/', create_recipes),
    path('register/', register),
]
