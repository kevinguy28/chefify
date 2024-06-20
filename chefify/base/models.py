from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Categories(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name
    
class IngredientUnit(models.Model):
    UNIT_CHOICES = {
        'tbsp': 'Tablespoon',
        'tsp': 'Teaspoon',
        'cup': 'Cup',
        'oz': 'Ounce',
        'g': 'Gram',
        'kg': 'Kilogram',
        'ml': 'Milliliter',
        'L':'Liter',
        'pinch': 'Pinch',
        'dash': 'Dash',
    }

    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='units')
    unit = models.CharField(max_length=15, choices=UNIT_CHOICES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)


    def __str__(self):
        return f"{self.quantity} {self.unit} {self.ingredient.name}"
    
class RecipeComponents(models.Model):
    name = models.CharField(max_length=30, blank=False)
    ingredients_list = models.ManyToManyField(IngredientUnit, blank = True, null=True)

    def __str__(self):
        return self.name

class Recipe(models.Model):
    name = models.CharField(max_length=50)
    categories = models.ForeignKey(Categories, on_delete=models.SET_NULL, null= True, blank=True)
    culinarian = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    calories = models.IntegerField(null=True, blank=True)
    # ingredients_list = models.ManyToManyField(Ingredient)
    recipe_components_list = models.ManyToManyField(RecipeComponents, blank= True, null=True)
    review = models.IntegerField(null=True, blank=True)
    private = models.BooleanField(default=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Steps(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    description = models.TextField()
    order = models.PositiveIntegerField()
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return("Step-"+ str(self.order))

class Profile(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_recipe_list = models.ManyToManyField(Recipe, blank=True)
    user_ingredients_list = models.ManyToManyField(Ingredient, blank=True)
    
    def __str__(self):
        return self.user.username

class Message(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    body = models.TextField()
    updated = models.DateTimeField(auto_now= True)
    created = models.DateTimeField(auto_now_add= True)

    class Meta:
        ordering = ['-updated', '-created']

    def __str__(self) -> str:
        return self.body[0:30]
    
class ShoppingList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    list_name = models.CharField(max_length=30, blank=True)
    ingredients = models.ManyToManyField(Ingredient, through='IngredientShoppingList', related_name='shopping_lists', blank=True)

    updated = models.DateTimeField(auto_now= True)
    created = models.DateTimeField(auto_now_add= True)
    
    def __str__(self) -> str:
        return f"{self.list_name}' of {self.user}"
    
class IngredientShoppingList(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity} | {self.ingredient.name}  | {self.shopping_list} | {self.shopping_list.user}"
    
    def get_quantity(self):
        return self.quantity