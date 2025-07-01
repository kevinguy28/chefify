import React, { ReactNode, SetStateAction } from "react";

export interface PrivateRouteProps {
    children: ReactNode;
}

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    uid: string;
}

export interface UserProfile {
    id: number;
    user: User;
    ownedIngredients: Array<Ingredient>;
    buyIngredients: Array<Ingredient>;
    favouriteRecipes: Array<Recipe>;
    friendsList: Array<User>;
    profilePicture?: string;
    profilePictureUrl: string;
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
    created: string;
    recipeImageUrl: string;
}

export interface RecipeComponent {
    id: number;
    name: string;
    recipe: Recipe;
    description: string;
    order: number;
}

export interface RecipeIngredient {
    id: number;
    recipe: Recipe;
    ingredient: Ingredient;
    unit: string;
    quantity: number;
    recipeComponent: RecipeComponent;
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
    id: number;
    review: number;
    recipe: Recipe;
    rating: number;
    review_text: string;
    user: User;
    likedBy: Array<User>;
    dislikedBy: Array<User>;
    likes: number;
    dislikes: number;
    userProfile: UserProfile;
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
    ingredientType: string;
    id: number;
}

export interface Unit {
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

export interface RecipeIngredientFormProp {
    recipe: Recipe;
    recipeComponents: Array<any>;
    updateRecipeComponentsAdd: (component: RecipeComponent) => Promise<void>;
    setFetchIngredients: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RecipeComponentDisplayProp {
    updateRecipeComponents: (componentId: number) => Promise<void>;
    recipeComponents: Array<any>;
    fetchIngredients: boolean;
    setFetchIngredients: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RecipeComponentCardProp {
    component: RecipeComponent;
    updateRecipeComponents: (componentId: number) => Promise<void>;
    fetchIngredients: boolean;
    setFetchIngredients: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ComponentIngredientProp {
    recipeId: number;
    component: RecipeComponent;
}

export interface RecipeReviewDisplayProp {
    recipe: Recipe;
}

export interface FriendsListDisplayProp {
    friend: UserProfile;
    handleRemoveFriend: (userProfileId: number) => Promise<void>;
    handleAddFriend: (userProfileId: number) => Promise<void>;
    addMode: boolean;
}

export interface RecipeContainerProp {
    recipe: Recipe;
    edit: boolean;
}

export interface RecipeQueryProp {
    filterInput: string;
    setFilterInput: React.Dispatch<React.SetStateAction<string>>;
    setCuisine: React.Dispatch<React.SetStateAction<string>>;
    cuisine: string;
    recipeCuisine: Array<any>;
    submitSearch: (e: React.FormEvent<HTMLDivElement>) => Promise<void>;
    fetchRecipes: (page: number) => Promise<void>;
    recent: boolean;
    setRecent: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface RecipeEditPageStateProp {
    pageState: "editRecipe" | "addStep" | "addIngredient";
    setPageState: React.Dispatch<
        React.SetStateAction<"editRecipe" | "addStep" | "addIngredient">
    >;
}
