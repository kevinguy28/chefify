from django.contrib import admin
from .models import Categories, Ingredient, Recipe, Profile, Steps, Message, ShoppingList, IngredientShoppingList, RecipeComponents, IngredientUnit
# Register your models here.

admin.site.register(Categories)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Profile)
admin.site.register(Steps)
admin.site.register(Message)
admin.site.register(ShoppingList)
admin.site.register(IngredientShoppingList)
admin.site.register(RecipeComponents)
admin.site.register(IngredientUnit)