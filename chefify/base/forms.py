from django.forms import ModelForm
from .models import Recipe, Ingredient, Categories
from django import forms

class RecipeForm(ModelForm):
    class Meta:
        model = Recipe 
        fields = '__all__'

class IngredientForm(ModelForm):
    class Meta:
        model = Ingredient
        fields = '__all__'

    def clean_name(self):
        name_value = self.cleaned_data.get('name').capitalize()
        # Check if the value already exists in the database
        if Ingredient.objects.filter(name=name_value).exists() or Ingredient.objects.filter(name=name_value + "s").exists():
            raise forms.ValidationError("This value already exists.")
        return name_value.capitalize()

class CategoriesForm(ModelForm):
    class Meta:
        model = Categories
        fields = '__all__'