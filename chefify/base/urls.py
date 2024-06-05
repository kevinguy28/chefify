from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name="home-page"),
    path('community_recipe_room/<str:pk>', views.community_recipe, name="community-recipe-room")
]