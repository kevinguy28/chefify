import os
from django.db.models import F
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

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