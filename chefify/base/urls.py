from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.login_page, name="login-page"),
    path('logout/', views.logout_user, name="logout"),
    path('register/', views.register, name="register"),
    path('add_ingredient/<str:pk>', views.add_ingredient_user, name="add-ingredient-user"),
    path('add_shopping_list/<str:pk>', views.add_shopping_list, name="add-shopping-list"),
    path('delete_shopping_list/<str:pk>', views.delete_shopping_list, name="delete-shopping-list"),
    path('', views.home, name="home"),
    path('community_recipe_room/<str:pk>', views.community_recipe, name="community-recipe-room"),
    path('add_recipe/<str:pk>', views.add_recipe, name="add-recipe"),
    path('add_ingredient', views.add_ingredient, name="add-ingredient"),
    path('recipe_component_creation/<str:pk>', views.recipe_component_creation, name="recipe-component-creation"),
    path('add_steps/<str:pk>', views.add_steps, name="add-steps"),
    path('update_steps/<str:pk>', views.update_steps, name="update-steps"),
    path('delete_steps/<str:pk>', views.delete_steps, name="delete-steps"),
    path('add_message/<str:pk>', views.add_message, name="add-message"),
    path('delete_message/<str:pk>', views.delete_message, name="delete-message"),
    path('delete_component_ingredient/<str:pk>', views.delete_component_ingredient, name="delete-component-ingredient"),
    path('delete_component/<str:pk>',views.delete_component, name="delete-component"),
    path('delete_recipe/<str:pk>', views.delete_recipe, name="delete-recipe"),
]