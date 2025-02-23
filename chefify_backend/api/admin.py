from django.contrib import admin
from .models import Recipe, Cuisine

# Register your models here.
admin.site.register(Cuisine)
admin.site.register(Recipe)
