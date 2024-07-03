from django.shortcuts import render, redirect
from .models import Recipe, Categories, Profile, Steps, Message, ShoppingList, IngredientShoppingList, Ingredient, RecipeComponents, IngredientUnit
from .forms import RecipeForm, IngredientForm, ProfileIngredientsListForm, ProfileRecipeListForm, StepsForm, MessageForm, CustomUserCreationForm, IngredientUnitForm
# from .forms import IngredientShoppingListForm
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

    form = CustomUserCreationForm()

    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.first_name = user.first_name.lower()
            user.last_name = user.last_name.lower()
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
    return render(request, "base/add_components/add_ingredient.html", context)

@login_required(login_url='/login')
def add_shopping_list(request, pk):
    user_shopping_list = ShoppingList.objects.get(id=pk)
    shopping_lists = ShoppingList.objects.filter(user=request.user)

    if request.method == "GET":
        if request.GET.get("del_id"):
            item_id = request.GET.get("del_id")
            IngredientShoppingList.objects.get(id=item_id).delete()
            return redirect(reverse('add-shopping-list',  kwargs={'pk': pk}))
            
    if request.method == "POST":
        ingredient = str(request.POST.get("ingredient")).capitalize()
        quantity = request.POST.get("quantity")
        sl = ShoppingList.objects.get(id=request.POST.get("list-id"))

        try:
            Ingredient.objects.get(name=ingredient)
        except Ingredient.DoesNotExist:
            Ingredient.objects.create(name=ingredient)
            
        shopping_list = IngredientShoppingList.objects.create(ingredient=Ingredient.objects.get(name=ingredient),shopping_list=sl,quantity=quantity)
        shopping_list.save()

    context = {'user_shopping_list': user_shopping_list, 'shopping_lists': shopping_lists, 'list_id': int(pk)}
    return render(request, 'base/add_components/add_shopping_list.html', context)

@login_required(login_url='/login')
def delete_shopping_list(request, pk):
    shopping_list = ShoppingList.objects.get(id=pk)

    if request.user != ShoppingList.objects.get(id=pk).user:
        return HttpResponse('You are not allowed here!')
    
    if request.method == "POST": 
        ShoppingList.objects.get(id=pk).delete()
        name = request.POST.get('value')
        next_url = request.POST.get('next', '/')

        # Debug log to check the value (you can remove this in production)
        print(f"Name: {name}")
        
        # Redirect to the previous page
        return redirect(next_url)

    context={'obj': shopping_list}
    return render(request, 'base/delete.html', context)
    
@login_required(login_url='/login')
def add_recipe_user(request, pk):
    form = ProfileRecipeListForm()

    context = {'form': form}
    return render(request, context)

def home(request):
    q = request.GET.get('q') if request.GET.get('q') != None else ''
    c_recipes = Recipe.objects.filter(Q(categories__name__icontains= q) & (Q(status='public')))
    form = ProfileIngredientsListForm()
    user_profile_ingredient_list = None
    user_profile_recipe_list = None
    user_shopping_list = None
    shopping_lists = None 

    if request.user.is_authenticated:
        user_shopping_list = ShoppingList.objects.filter(user=User.objects.get(id=request.user.id))
        shopping_lists = ShoppingList.objects.filter(user=request.user)      

    if request.user.is_authenticated:
        if request.method == "POST":
            if request.POST.get("form-type"):
                if(request.POST.get("form-type") == "form-name-shopping-list"):
                    ShoppingList.objects.create(user=request.user, list_name=request.POST.get("name-shopping-list"))

    if request.user.is_authenticated:
        user_profile_ingredient_list = Profile.objects.get(user=request.user.id).user_ingredients_list.all()
        user_profile_recipe_list = Profile.objects.get(user=request.user.id).user_recipe_list.all()
        user_profile_recipe_list = user_profile_recipe_list.filter(Q(categories__name__icontains=q))

    # Add Recipes

    if request.user.is_authenticated:
        if request.method == "POST":
            if request.POST.get("form-type") == "form-add-recipe":
                recipe_name = request.POST.get("form-recipe").capitalize()
                category = request.POST.get("category-select").capitalize()
                if Categories.objects.get(name=category):
                    recipe = Recipe.objects.create(name=recipe_name, categories=Categories.objects.get(name=category), culinarian=request.user)
                    user_profile = Profile.objects.get(user=request.user)
                    user_profile.user_recipe_list.add(recipe)
                    return redirect(reverse('community-recipe-room', args=[recipe.id]))

    # Add/Remove Ingredients to User Profile & Creates Ingredients if it does not exist

    if request.user.is_authenticated:
        
        if request.GET.get("del_id"):
            del_id = request.GET.get("del_id")
            the_ingredient = Ingredient.objects.get(id=del_id)
            Profile.objects.get(user=request.user).user_ingredients_list.remove(the_ingredient)
            return redirect(reverse('home'))

        if request.method == "POST":
            if request.POST.get("ingredient-input") == "ingredient-to-add":
                searched_ingredient = request.POST.get("ingredient-to-add").capitalize()
                try:
                    the_ingredient = Ingredient.objects.get(name=searched_ingredient) or Ingredient.objects.get(name=the_ingredient + "s")
                    profile = Profile.objects.get(user=request.user)
                    if not the_ingredient in profile.user_ingredients_list.all():
                        profile.user_ingredients_list.add(the_ingredient)
                except Ingredient.DoesNotExist:
                    added_ingredient = Ingredient.objects.create(name=searched_ingredient)
                    Profile.objects.get(user=request.user).user_ingredients_list.add(added_ingredient)
            elif request.POST.get("ingredient-input") == "ingredient-to-remove":
                searched_ingredient = request.POST.get("ingredient-to-remove").capitalize()
                if Ingredient.objects.filter(name=searched_ingredient).exists():
                    the_ingredient = Ingredient.objects.get(name = searched_ingredient)
                    Profile.objects.get(user=request.user).user_ingredients_list.remove(the_ingredient)

    # Add Shopping List

    if request.user.is_authenticated:
        if request.method == "POST":
            if request.POST.get("shopping-list-input"):
                if(request.POST.get("shopping-list-input") == "form-name-shopping-list"):
                    ShoppingList.objects.create(user=request.user, list_name=request.POST.get("name-shopping-list"))
                elif(request.POST.get("add-to-list")) == "ingredient-to-add":
                    ingredient = str(request.POST.get("ingredient-to-add").capitalize())
                    quantity = request.POST.get("quantity")
                    shopping_list = request.POST.get("list-id")
                    try:
                        Ingredient.objects.get(name=ingredient)
                    except Ingredient.DoesNotExist:
                        Ingredient.objects.create(name=ingredient)
                    shopping_list = IngredientShoppingList.objects.create(ingredient=Ingredient.objects.get(name=ingredient),shopping_list=ShoppingList.objects.get(id=shopping_list),quantity=quantity)
                    shopping_list.save()

    context = {'c_recipe': c_recipes, 'categories': Categories.objects.all(), 'user_profile_ingredient_list': user_profile_ingredient_list, "user_profile_recipe_list": user_profile_recipe_list, 
               'user_shopping_list': user_shopping_list, 'shopping_lists': shopping_lists, 'form':form}
    return render(request, 'base/home.html', context)

@login_required(login_url="/login")
def add_recipe(request, pk):
    form = RecipeForm()
    categories = Categories.objects.all().order_by('name')
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
    context = {'form': form, 'categories': categories}
    return render(request, 'base/add_components/add_recipe.html', context)

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
    return render(request, 'base/add_components/add_ingredient.html', context)

# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------
# Community Recipe Room

@login_required(login_url="/login")
def community_recipe(request, pk):
    recipe = Recipe.objects.get(id=pk)
    steps = Steps.objects.filter(recipe=pk)
    user_messages = Message.objects.filter(recipe=pk)
    
    if request.user.is_authenticated:

        if request.method == "GET":
            if request.GET.get("del_id"):
                item_id = request.GET.get("del_id")
                Message.objects.get(id=item_id).delete()
                return redirect(reverse('community-recipe-room', args=[pk]))
                

        if request.method == "POST":
            if request.POST.get("form-type") == "edit-page":
                if request.POST.get("status") == "status-public":
                    value = "public"
                elif request.POST.get("status") == "status-private":
                    value = "private"
                elif request.POST.get("status") == "status-friends-only" :
                    value = "friends-only"
                recipe.status = value
                recipe.save()
                return redirect(request.get_full_path())
            elif request.POST.get("form-type") == "comment":
                message_user = request.user
                message_recipe = Recipe.objects.get(id=pk)
                if(request.POST.get("discussion-box") and request.POST.get("discussion-box").strip()):
                    body = request.POST.get("discussion-box")
                    Message.objects.create(user=message_user, recipe=message_recipe, body=body).save()
  
    context = {'recipe': recipe, 'steps':steps, 'user_messages': user_messages}
    return render(request, 'base/community_recipe_room.html', context)

@login_required(login_url="/login")
def recipe_component_creation(request, pk):
    recipe = Recipe.objects.get(id=pk)

    if request.method == 'POST':
        if request.POST.get('form-type') == "form-add-component":
            name = request.POST.get('recipe-component').capitalize()
            component = RecipeComponents.objects.create(name=name)
            component.save()
            recipe.recipe_components_list.add(component)
            return redirect(request.get_full_path())
        elif request.POST.get('form-type') == "form-add-ingredient":
            unit = request.POST.get('unit')
            quantity = request.POST.get('quantity')
            component_id = request.POST.get('component-id')

            ingredient = request.POST.get('add-ingredient').capitalize()

            try:
                ingredient_to_add = Ingredient.objects.get(name=ingredient)
            except Ingredient.DoesNotExist:
                ingredient_to_add = Ingredient.objects.create(name=ingredient)
                
            ingredient_unit = IngredientUnit.objects.create(ingredient=ingredient_to_add, unit=unit, quantity=quantity)
            RecipeComponents.objects.get(id=component_id).ingredients_list.add(ingredient_unit)
            return redirect(request.get_full_path())
            
        
    context = {'recipe': recipe}
    return render(request, 'base/add_components/recipe_component_creation.html', context)

@login_required(login_url="/login")
def add_steps(request, pk):
    
    if request.method == "POST":
            step_user = request.user
            step_recipe = Recipe.objects.get(id=pk)
            last_step = Steps.objects.filter(recipe=step_recipe).order_by('-order').first()
            if last_step:
                last_step = last_step.order + 1
            else:
                last_step= 1
            description = request.POST.get("textarea")
            Steps.objects.create(recipe=step_recipe, user=step_user, order=last_step, description=description).save()
            return redirect(reverse('community-recipe-room', args=[pk]))

    context = {}
    return render(request, 'base/add_components/add_steps.html', context)

@login_required(login_url="/login")
def update_steps(request, pk):
    if request.user != Steps.objects.get(id=pk).user:
        return HttpResponse('You are not allowed here!')
    
    form = StepsForm(instance=Steps.objects.get(id=pk))
    
    if request.method == "POST":
        form = StepsForm(request.POST, instance=Steps.objects.get(id=pk))
        if form.is_valid():
            form.save()
            return redirect(reverse('community-recipe-room', args=[Steps.objects.get(id=pk).recipe.id]))
        
    context = {'form': form}
    return render(request, 'base/add_components/add_steps.html', context)

@login_required(login_url="/login")
def delete_steps(request,pk):

    obj = Steps.objects.get(id=pk)

    if request.user != Steps.objects.get(id=pk).user:
        return HttpResponse('You are not allowed here!')
    
    if request.method == "POST": 
        Steps.objects.get(id=pk).delete()
        name = request.POST.get('value')
        next_url = request.POST.get('next', '/')

        # Debug log to check the value (you can remove this in production)
        print(f"Name: {name}")
        
        # Redirect to the previous page
        return redirect(next_url)

    return render(request, 'base/delete.html', context={'obj': obj})

@login_required(login_url="/login")
def add_message(request,pk):

    form = MessageForm()
    if request.method == "POST":
        print("gat")
        form = MessageForm(request.POST)
        message_form = form.save(commit=False)
        message_form.user = request.user
        message_form.recipe = Recipe.objects.get(id=pk)
        message_form.save()
        return redirect(reverse('community-recipe-room', args=[pk]))
    
    context = {"form": form}
    return render(request, 'base/add_components/add_message.html', context)

@login_required(login_url="/login")
def delete_message(request, pk):

    obj = Message.objects.get(id=pk)
       
    if request.user != Message.objects.get(id=pk).user:
        return HttpResponse('You are not allowed here!')
    
    if request.method == "POST": 
        Message.objects.get(id=pk).delete()
        name = request.POST.get('value')
        next_url = request.POST.get('next', '/')

        # Debug log to check the value (you can remove this in production)
        print(f"Name: {name}")
        
        # Redirect to the previous page
        return redirect(next_url)

    return render(request, 'base/delete.html', context={'obj': obj})

@login_required(login_url="/login")
def delete_component_ingredient(request, pk):
    
    obj = IngredientUnit.objects.get(id=pk)
       
    if request.method == "POST": 
        IngredientUnit.objects.get(id=pk).delete()
        name = request.POST.get('value')
        next_url = request.POST.get('next', '/')

        # Debug log to check the value (you can remove this in production)
        print(f"Name: {name}")
        
        # Redirect to the previous page
        return redirect(next_url)

    return render(request, 'base/delete.html', context={'obj': obj})

@login_required(login_url="/login")
def delete_component(request, pk):

    obj = RecipeComponents.objects.get(id=pk)
       
    if request.method == "POST": 
        RecipeComponents.objects.get(id=pk).delete()
        name = request.POST.get('value')
        next_url = request.POST.get('next', '/')

        # Debug log to check the value (you can remove this in production)
        print(f"Name: {name}")
        
        # Redirect to the previous page
        return redirect(next_url)

    return render(request, 'base/delete.html', context={'obj': obj})

@login_required(login_url="/login")
def delete_recipe(request, pk):
    obj = Recipe.objects.get(id=pk)

    if request.method == "POST":
        obj.delete()
        name = request.POST.get("value")
        next_url = request.POST.get('next', '/')

        # Debug log to check the value (you can remove this in production)
        print(f"Name: {name}")
        
        # Redirect to the previous page
        return redirect(next_url)
    
    return render(request, 'base/delete.html', context={'obj': obj})

