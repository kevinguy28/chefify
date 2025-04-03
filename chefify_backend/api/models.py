import os
from django.db.models import F
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Ingredient(models.Model):
    TYPE ={
        "fruitsVegetables": "Fruits & Vegetables",
        "protein": "Protein",
        "grains": "Grains",
        "dairy": "Dairy",
        "herbsSpices": "Herbs & Spices",
        "other": "Other"
    }
    name = models.CharField(max_length=100)
    ingredientType = models.CharField(max_length=30,choices=TYPE, default='other')

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['name', 'ingredientType'], name='unique_ingredient_name_type')
        ]
        
    def __str__(self):
        return self.name.capitalize() if self.name else "Unnamed Ingredient"

class Cuisine(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    STATUS_CHOICES = {
        'private': 'Private',
        'public': 'Public',
        'friends': 'Friends',
    }
    RATING_CHOICES = [(i/2, str(i/2)) for i in range(0, 11)]
    rating = models.DecimalField(max_digits=2, decimal_places=1,choices=RATING_CHOICES,validators=[MinValueValidator(0.0), MaxValueValidator(5.0)], default=0.0)
    reviewers = models.ManyToManyField(User, blank=True, related_name="reviewed_recipes")
    name = models.CharField(max_length=60)
    cuisine = models.ForeignKey(Cuisine, on_delete=models.SET_NULL, null=True, blank=True)
    privacy = models.CharField(max_length=15, choices=STATUS_CHOICES, default='private')
    description = models.TextField(max_length=400, blank=True)
    image = models.ImageField(upload_to='images/recipes/', blank=True, null=True)
    ingredients = models.ManyToManyField("Ingredient", through="RecipeIngredient", blank=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.id:
            oldRecipe = Recipe.objects.get(id=self.id)
            if (oldRecipe.image != self.image) and oldRecipe.image:
                oldImageUrl = oldRecipe.image.path
                if os.path.isfile(oldImageUrl):
                    os.remove(oldImageUrl)
        super().save(*args, **kwargs)

    def update_rating(self):
        reviews = Review.objects.filter(recipe=self)
        total_reviews = self.reviewers.count()
        if total_reviews > 0:
            sum_ratings = reviews.aggregate(total=models.Sum('rating'))['total']
            average = round((sum_ratings / total_reviews) * 2) / 2  # Round to the nearest 0.
            self.rating = average
        else:
            self.rating = 0.0  # No reviews, so set rating to 0
        self.save()

    def remove_user(self, review_instance):
        user = review_instance.user 
        self.reviewers.remove(user)
        self.save()
        self.update_rating()
        
    def __str__(self):
        return self.name

class RecipeSteps(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="steps")
    title = models.CharField(max_length=50, default="")
    description = models.TextField()
    order = models.PositiveIntegerField(blank=True)
    
    class Meta:
        ordering = ["order"]
        verbose_name = "Recipe Step"
        verbose_name_plural = "Recipe Steps"

    def __str__(self):
        return("Step-"+ str(self.order) + ": " + self.title[0:30])
    
    def save(self, *args, **kwargs):
        if not self.order:
            last_order = RecipeSteps.objects.filter(recipe=self.recipe).aggregate(models.Max("order"))["order__max"]
            self.order = (last_order + 1) if last_order else 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        # Update the order of instances with a larger order value
        RecipeSteps.objects.filter(order__gt=self.order).update(order=F('order') - 1)
        # Call the superclass delete method to delete the instance
        super(RecipeSteps, self).delete(*args, **kwargs)

class Review(models.Model):
    RATING_CHOICES = [(i/2, str(i/2)) for i in range(1, 11)]
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    rating = models.DecimalField(max_digits=2, decimal_places=1,choices=RATING_CHOICES,validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    review_text = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'recipe'], name='unique_review_per_user_per_recipe')
        ]

    def __str__(self):
        return f"Review: {self.rating}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    ownedIngredients = models.ManyToManyField(Ingredient, related_name="owned_by", blank=True)
    buyIngredients = models.ManyToManyField(Ingredient, related_name="to_buy_by", blank=True)

    def __str__(self):
        return self.user.username
    
class RecipeComponent(models.Model):
    name = models.CharField(max_length=255)
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    description = models.TextField(null=True, blank=True)
    order = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        ordering = ["order"]

    def save(self, *args, **kwargs):
        if not self.order:
            last_order = RecipeComponent.objects.filter(recipe=self.recipe).aggregate(models.Max("order"))["order__max"]
            self.order = (last_order + 1) if last_order else 1
        super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        RecipeComponent.objects.filter(order__gt=self.order).update(order=F('order') - 1)
        super(RecipeComponent, self).delete(*args, **kwargs)

    def __str__(self):
        return("Step-"+ str(self.order) + ": " + self.name[0:30])
    
class RecipeIngredient(models.Model):
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
    recipe = models.ForeignKey("Recipe", on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='units')
    unit = models.CharField(max_length=15, choices=UNIT_CHOICES)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    recipeComponent = models.ForeignKey(RecipeComponent, related_name="ingredients", on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.quantity} {self.unit} {self.ingredient.name} in {self.recipe.name}"
    
