from django.forms import ModelForm
from .models import Recipe, Ingredient, Categories, Profile, Steps, Message, IngredientUnit
from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class CustomUserCreationForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username','password1', 'password2']

class RecipeForm(ModelForm):
    class Meta:
        model = Recipe 
        fields = '__all__'
        exclude = ['culinarian']

class IngredientForm(ModelForm):
    class Meta:
        model = Ingredient
        fields = '__all__'

    def clean_name(self):
        name_value = self.cleaned_data.get('name').capitalize()
        name_value = ' '.join(name_value.split())
        # Check if the value already exists in the database
        if Ingredient.objects.filter(name=name_value).exists() or Ingredient.objects.filter(name=name_value + "s").exists():
            raise forms.ValidationError("This value already exists.")
        return name_value.capitalize()

class CategoriesForm(ModelForm):
    class Meta:
        model = Categories
        fields = '__all__'


class StepsForm(ModelForm):
    class Meta:
        model = Steps
        fields = ["description"]

class ProfileIngredientsListForm(ModelForm):
    class Meta:
        model = Profile
        fields = ['user_ingredients_list']

class ProfileRecipeListForm(ModelForm):
    class Meta:
        model = Profile
        fields = ['user_recipe_list']

class MessageForm(ModelForm):
    class Meta:
        model = Message
        fields = ['body']

class IngredientUnitForm(ModelForm):
    class Meta:
        model = IngredientUnit
        fields = '__all__'
        widgets = {
            'field1': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter something'})
        }