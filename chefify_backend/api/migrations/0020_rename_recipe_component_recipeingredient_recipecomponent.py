# Generated by Django 5.1.6 on 2025-04-01 22:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0019_alter_recipecomponent_options_recipecomponent_order'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recipeingredient',
            old_name='recipe_component',
            new_name='recipeComponent',
        ),
    ]
