from django.db.models.signals import m2m_changed
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Recipe, Review, User, UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=Review)
def update_recipe_rating(sender, instance, **kwargs):
    # Get the recipe associated with the review
    recipe = instance.recipe
    recipe.reviewers.add(instance.user)
    recipe.save()
    recipe.update_rating()

@receiver(post_delete, sender=Review)
def delete_recipe_rating(sender, instance, **kwargs):
    recipe = instance.recipe
    recipe.reviewers.remove(instance.user)
    recipe.save()
    

@receiver(m2m_changed, sender=Recipe.reviewers.through)
def reviewers_changed(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    if action in ["post_add", "post_remove"]:
        instance.update_rating()
        instance.save()

