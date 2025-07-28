"""Custom Signals to handle specific side function to existing database field updates."""

# pylint: disable=no-member
from django.db.models.signals import m2m_changed, post_delete, post_save
from django.dispatch import receiver

from .models import Recipe, Review

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         UserProfile.objects.create(user=instance)


@receiver(post_save, sender=Review)
def update_recipe_rating(_sender, instance, **_kwargs):
    """Update Average Recipe Rating to account for new reviewer."""
    # Get the recipe associated with the review
    recipe = instance.recipe
    recipe.reviewers.add(instance.user)
    recipe.save()
    recipe.update_rating()


@receiver(post_delete, sender=Review)
def delete_recipe_rating(_sender, instance, **_kwargs):
    """Update Average Recipe Rating to account for reviewer who deleted their review."""
    recipe = instance.recipe
    recipe.reviewers.remove(instance.user)
    recipe.save()


@receiver(m2m_changed, sender=Recipe.reviewers.through)
def reviewers_changed(
    _sender, instance, action, _reverse, _model, _pk_set, _using, **_kwargs
):
    """Updates value rating on when a new Reviewer is added or removed from Recipe.reviewers."""
    if action in ["post_add", "post_remove"]:
        instance.update_rating()
        instance.save()


@receiver(m2m_changed, sender=Review.likedBy.through)
def liked_by_changed(_sender, instance, action, _pk_set, **_kwargs):
    """Update value liked of when a Reviewer is added or removed from Review.likedBy."""
    if action == "post_add":
        instance.add_like()
    if action == "post_remove":
        instance.remove_like()


@receiver(m2m_changed, sender=Review.dislikedBy.through)
def dislike_by_changed(_sender, instance, action, _pk_set, **_kwargs):
    """Update value dislike of when a Reviewer is added or removed from Review.dislikedBy."""
    if action == "post_add":
        instance.add_dislike()
    if action == "post_remove":
        instance.remove_dislike()
