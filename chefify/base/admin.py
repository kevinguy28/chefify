from django.contrib import admin
from .models import Categories, Ingredient, Recipe
# Register your models here.

admin.site.register(Categories)
admin.site.register(Ingredient)
admin.site.register(Recipe)