# Generated by Django 5.0.6 on 2024-06-08 23:40

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("base", "0010_profile"),
    ]

    operations = [
        migrations.AlterField(
            model_name="profile",
            name="user_ingredients_list",
            field=models.ManyToManyField(blank=True, to="base.ingredient"),
        ),
    ]