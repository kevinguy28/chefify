from django.shortcuts import render, redirect
from .models import Recipe, Categories
from .forms import RecipeForm, IngredientForm
from django.db.models import Q

# Create your views here.

c_recipes = [
    {'id': 1, 'name': 'Spanish Dish 1', 'cuisine': 'Spanish'},
    {'id': 2, 'name': 'Vietnamese Dish 1', 'cuisine': 'Vietnamese'},
    {'id': 3, 'name': 'Carrribean Dish 1', 'cuisine': 'Carribean'},
]

def home(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    c_recipes = Recipe.objects.filter(Q(categories__name__icontains= q))
    context = {'c_recipe': c_recipes, 'categories': Categories.objects.all()}
    return render(request, 'base/home.html', context)

def community_recipe(request, pk):
    recipe = Recipe.objects.get(id=pk)
    context = {'recipe': recipe}
    return render(request, 'base/community_recipe_room.html', context)

def add_recipe(request):
    form = RecipeForm()

    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')

    context = {'form': form}
    return render(request, 'base/add_recipe.html', context)

def add_ingredient(request):
    form = IngredientForm()

    if request.method == 'POST':
        form = IngredientForm(request.POST)
        if form.is_valid():
            form.save()
            if request.GET.get('source') == 'recipe':
                return redirect('add-recipe')
            return redirect('home')

    context = {'form': form}
    return render(request, 'base/add_ingredient.html', context)

