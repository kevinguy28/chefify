from django.shortcuts import render
from .models import Recipe

# Create your views here.

c_recipes = [
    {'id': 1, 'name': 'Spanish Dish 1', 'cuisine': 'Spanish'},
    {'id': 2, 'name': 'Vietnamese Dish 1', 'cuisine': 'Vietnamese'},
    {'id': 3, 'name': 'Carrribean Dish 1', 'cuisine': 'Carribean'},
]

def home(request):
    context = {'c_recipe': Recipe.objects.all()}
    return render(request, 'base/home.html', context)

def community_recipe(request, pk):
    recipe = Recipe.objects.get(id=pk)
    context = {'recipe': recipe}
    return render(request, 'base/community_recipe_room.html', context)
