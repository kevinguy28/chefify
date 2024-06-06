from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('community_recipe_room/<str:pk>', views.community_recipe, name="community-recipe-room"),
    path('add_recipe', views.add_recipe, name="add-recipe"),
    path('add_ingredient', views.add_ingredient, name="add-ingredient")
]