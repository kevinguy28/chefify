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
    cuisine: Cuisine;
    description: string;
    privacy: string;
    image?: string; // Optional field
}

export interface RecipeEditFormProps {
    recipe: Recipe;
    loaded: boolean;
    onRecipeUpdate: (updatedRecipe: Recipe) => void;
}
