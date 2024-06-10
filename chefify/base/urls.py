from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.login_page, name="login-page"),
    path('logout/', views.logout_user, name="logout"),
    path('register/', views.register, name="register"),
    path('add_ingredient/<str:pk>', views.add_ingredient_user, name="add-ingredient-user"),
    path('', views.home, name="home"),
    path('community_recipe_room/<str:pk>', views.community_recipe, name="community-recipe-room"),
    path('add_recipe/<str:pk>', views.add_recipe, name="add-recipe"),
    path('add_ingredient', views.add_ingredient, name="add-ingredient"),
    path('add_steps/<str:pk>', views.add_steps, name="add-steps"),
    path('update_steps/<str:pk>', views.update_steps, name="update-steps"),
    path('delete_steps/<str:pk>', views.delete_steps, name="delete-steps"),
]