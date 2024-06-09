from django.shortcuts import render, redirect
from .models import Recipe, Categories, Profile
from .forms import RecipeForm, IngredientForm, ProfileIngredientsListForm
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
# Create your views here.

def login_page(request):

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        try:
            user = User.objects.get(username = username)
        except:
            messages.error(request,'User does not exist')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request,user)
            return redirect('home')
        else:
            messages.error(request, "Username OR Password does not exist")
    context ={}
    return render(request, 'base/login_register.html', context)

def logout_user(request):
    logout(request)
    return redirect('home')

@login_required(login_url='/login')
def add_ingredient_user(request, pk):

    profile = Profile.objects.get(user=pk)
    form = ProfileIngredientsListForm()
    
    if request.method == "POST":
        form = ProfileIngredientsListForm(request.POST, instance=profile)
        if form.is_valid():
            for ingredient in form.cleaned_data['user_ingredients_list']:
                if not ingredient in profile.user_ingredients_list.all():
                    profile.user_ingredients_list.add(ingredient)
        return redirect('home')

    context = {'form': form}
    return render(request, "base/add_ingredient.html", context)


def home(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    c_recipes = Recipe.objects.filter(Q(categories__name__icontains= q))
    context = {'c_recipe': c_recipes, 'categories': Categories.objects.all()}
    return render(request, 'base/home.html', context)

@login_required(login_url="/login")
def community_recipe(request, pk):
    recipe = Recipe.objects.get(id=pk)
    context = {'recipe': recipe}
    return render(request, 'base/community_recipe_room.html', context)

@login_required(login_url="/login")
def add_recipe(request):
    form = RecipeForm()

    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('home')

    context = {'form': form}
    return render(request, 'base/add_recipe.html', context)

@login_required(login_url="/login")
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

