# Generated by Django 5.1.6 on 2025-02-26 18:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_cuisine'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='cuisine',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.cuisine'),
        ),
    ]
