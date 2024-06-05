from django.db import models

# Create your models here.

class Categories(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=30)
    # category =
    # calories = 
    def __str__(self):
        return self.name
    
class Recipe(models.Model):
    name = models.CharField(max_length=50)
    
    cuisine = models.ForeignKey(Categories, on_delete=models.SET_NULL, null= True, blank=True)

    calories = models.IntegerField(null=True, blank=True)

    ingredients_list = models.ManyToManyField(Ingredient)

    review = models.IntegerField(null=True, blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    