from django.contrib import admin
from .models import Recipe, Cuisine

class MyRecipe(admin.ModelAdmin):
    list_display = ('id', 'user', 'name')

# Register your models here.
admin.site.register(Cuisine)
admin.site.register(Recipe, MyRecipe)
