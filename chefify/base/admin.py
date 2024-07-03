from django.contrib import admin
from .models import Categories, Ingredient, Recipe, Profile, Steps, Message, ShoppingList, IngredientShoppingList, RecipeComponents, IngredientUnit
# Register your models here.


class MyModelAdmin(admin.ModelAdmin):
    list_display = ('id', 'ingredient', 'shopping_list', 'quantity')  # Include 'id' and other fields you want to display

admin.site.register(Categories)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Profile)
admin.site.register(Steps)
admin.site.register(Message)
admin.site.register(ShoppingList)
admin.site.register(RecipeComponents)
admin.site.register(IngredientUnit)
admin.site.register(IngredientShoppingList, MyModelAdmin)