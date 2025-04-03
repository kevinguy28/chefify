import React, { ReactNode, SetStateAction } from "react";

export interface PrivateRouteProps {
    children: ReactNode;
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Cuisine {
    id: number;
    name: string;
}

export interface Recipe {
    id: number;
    user: User;
    name: string;
    rating: number;
    cuisine: Cuisine;
    description: string;
    privacy: string;
    image?: string;
}

export interface RecipeComponent {
    id: number;
    name: string;
    recipe: Recipe;
    description: string;
    order: number;
}

export interface RecipeEditFormProps {
    recipe: Recipe | null;
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RecipeCardProp {
    recipe: Recipe | null;
    traverseMode: boolean;
    editMode: boolean;
}

export interface Review {
    review: number;
    recipe: Recipe;
    rating: number;
    review_text: string;
    user: User;
}

export interface ReviewCardProps {
    reviewUser: User | undefined;
    reviewRating: number | undefined;
    reviewText: string | undefined;
    isUserReview: boolean;
}

export interface ReviewFormProps {
    review: Review | null;
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RecipeCatalogProps {
    recipes: Array<Recipe>;
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
    traverseMode: boolean;
    editMode: boolean;
    fetchRecipes: (page: number) => Promise<void>;
}

export interface Ingredient {
    name: string;
    id: number;
}

export interface ShoppingListFormProp {
    isOwned: boolean;
    setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserProfileIngredientListCardProp {
    isOwned: boolean;
    suffix: "own" | "sl";
    refresh: boolean;
    setRefresh: React.Dispatch<SetStateAction<boolean>>;
}

export interface DropDownMenuProp {
    type:
        | "dairy"
        | "fruitsVegetables"
        | "grains"
        | "herbsSpices"
        | "protein"
        | "other";
    ingredientList: Array<Ingredient>;
    name: string;
    suffix: string;
    isOwned: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UnitProp {
    unit:
        | "tbsp"
        | "tsp"
        | "cup"
        | "oz"
        | "g"
        | "kg"
        | "ml"
        | "L"
        | "pinch"
        | "dish";
}

export interface RecipeIngredientFormProp {
    recipe: Recipe;
    recipeComponents: Array<any>;
    updateRecipeComponentsAdd: (component: RecipeComponent) => Promise<void>;
    fetchRecipeComponents: () => Promise<void>;
}

export interface RecipeComponentDisplayProp {
    recipe: Recipe;
    updateRecipeComponents: (componentId: number) => Promise<void>;
    recipeComponents: Array<any>;
}

export interface RecipeComponentCardProp {
    component: RecipeComponent;
    updateRecipeComponents: (componentId: number) => Promise<void>;
}
