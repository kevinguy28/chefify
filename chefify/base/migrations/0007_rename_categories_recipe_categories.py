# Generated by Django 5.0.6 on 2024-06-06 02:28

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("base", "0006_rename_cuisine_recipe_categories"),
    ]

    operations = [
        migrations.RenameField(
            model_name="recipe",
            old_name="Categories",
            new_name="categories",
        ),
    ]
