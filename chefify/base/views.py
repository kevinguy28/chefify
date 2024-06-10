from django.shortcuts import render, redirect
from .models import Recipe, Categories, Profile, Steps
from .forms import RecipeForm, IngredientForm, ProfileIngredientsListForm, ProfileRecipeListForm, StepsForm
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect

# Create your views here.

def login_page(request):
    page = "login"
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
    context = {'page': page}
    return render(request, 'base/login_register.html', context)

def logout_user(request):
    logout(request)
    return redirect('home')

def register(request):
    form = UserCreationForm()

    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            login(request, user)
            Profile.objects.create(user=user).save()
            return redirect('home')
        else:
            messages.error(request, 'An error occured during registration')
    context = {'form': form}
    return render(request, 'base/login_register.html', context)

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

@login_required(login_url='/login')
def add_recipe_user(request, pk):
    profile = Profile.objects.get(user=pk)
    form = ProfileRecipeListForm()

    context = {'form': form}
    return render(request, context)

def home(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    c_recipes = Recipe.objects.filter(Q(categories__name__icontains= q) & Q(private=False))
    user_profile_ingredient_list = None
    user_profile_recipe_list = None

    if request.user.is_authenticated:
        user_profile_ingredient_list = Profile.objects.get(user=request.user.id).user_ingredients_list.all()
        user_profile_recipe_list = Profile.objects.get(user=request.user.id).user_recipe_list.all()
        user_profile_recipe_list = user_profile_recipe_list.filter(Q(categories__name__icontains=q))

    context = {'c_recipe': c_recipes, 'categories': Categories.objects.all(), 'user_profile_ingredient_list': user_profile_ingredient_list, "user_profile_recipe_list": user_profile_recipe_list}
    return render(request, 'base/home.html', context)

@login_required(login_url="/login")
def add_recipe(request, pk):
    form = RecipeForm()
    user_profile = Profile.objects.get(user=pk)
    if request.method == 'POST':
        form = RecipeForm(request.POST)
        if form.is_valid():
            recipe_form = form.save(commit=False)
            recipe_form.culinarian = request.user
            recipe_form.save()
            form.save_m2m()
            user_profile.user_recipe_list.add(recipe_form)
            return redirect('home')
    context = {'form': form}
    return render(request, 'base/add_recipe.html', context)

@login_required(login_url="/login")
def add_ingredient(request):

    form = IngredientForm()

    if request.method == 'POST':
        form = IngredientForm(request.POST)
        print(form)
        if form.is_valid():
            form.save()
            if request.GET.get('source') == 'recipe':
                return redirect(reverse('add-recipe', args=[request.user.id]))
            return redirect('home')

    context = {'form': form}
    return render(request, 'base/add_ingredient.html', context)

@login_required(login_url="/login")
def community_recipe(request, pk):
    recipe = Recipe.objects.get(id=pk)
    steps = Steps.objects.filter(recipe=pk)
    context = {'recipe': recipe, 'steps':steps}
    return render(request, 'base/community_recipe_room.html', context)

@login_required(login_url="/login")
def add_steps(request, pk):
    form = StepsForm()

    if request.method == "POST":
        form = StepsForm(request.POST)
        if form.is_valid():
            step_form = form.save(commit=False)
            step_form.author = request.user
            step_form.recipe = Recipe.objects.get(id=pk)
            last_step = Steps.objects.filter(recipe=step_form.recipe).order_by('-order').first()
            if last_step:
                step_form.order = last_step.order + 1
            else:
                step_form.order = 1
            step_form.save()
        return redirect(reverse('community-recipe-room', args=[pk]))

    context = {'form':form}
    return render(request, 'base/add_steps.html', context)

@login_required(login_url="/login")
def update_steps(request, pk):
    if request.user != Steps.objects.get(id=pk).author:
        return HttpResponse('You are not allowed here!')
    
    form = StepsForm(instance=Steps.objects.get(id=pk))
    
    if request.method == "POST":
        form = StepsForm(request.POST, instance=Steps.objects.get(id=pk))
        if form.is_valid():
            form.save()
            return redirect(reverse('community-recipe-room', args=[Steps.objects.get(id=pk).recipe.id]))
        
    context = {'form': form}
    return render(request, 'base/add_steps.html', context)

@login_required(login_url="/login")
def delete_steps(request,pk):
    if request.user != Steps.objects.get(id=pk).author:
        return HttpResponse('You are not allowed here!')
    print(request.method)
    if request.method == "POST": #THIS NEEDS TO BE RESOLVED, PROLLY ADD A CONFIRMATION DELETE SCREEN
        print(Steps.objects.get(id=pk))
        Steps.objects.get(id=pk).delete()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))
    