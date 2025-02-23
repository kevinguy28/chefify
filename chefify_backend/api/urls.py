from django.urls import path
from .views import logout, is_authenticated, get_recipes, CustomTokenObtainPairView, CustomRefreshTokenView, register

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomRefreshTokenView.as_view(), name='token_refresh'),
    path('logout/', logout),
    path('authenticated/', is_authenticated),
    path('recipes/', get_recipes),
    path('register/', register),
]