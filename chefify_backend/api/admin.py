from django.contrib import admin
from django.contrib.auth.models import User
from .models import Recipe, Cuisine, RecipeSteps, Review

class MyRecipe(admin.ModelAdmin):
    list_display = ('id', 'user', 'name')

class MyUser(admin.ModelAdmin):
    list_display = ('id', 'username', 'email')  # Use 'email' instead of 'email address'

# Register your models here.
admin.site.unregister(User)
admin.site.register(User, MyUser)
admin.site.register(Cuisine)
admin.site.register(Recipe, MyRecipe)
admin.site.register(RecipeSteps)
admin.site.register(Review)
