import React from "react";
import RecipeCard from "./RecipeCard";
import { RecipeCatalogProps } from "@/interfaces/interfaces";
import RecipeContainer from "./RecipeContainer";

const RecipeCatalog: React.FC<RecipeCatalogProps> = ({
    recipes,
    currentPage,
    hasNext,
    hasPrevious,
    traverseMode,
    editMode,
    fetchRecipes,
}) => {
    return (
        <div>
            {recipes.map((recipe) => (
                <div>
                    <RecipeContainer recipe={recipe} />
                </div>
            ))}
        </div>
    );
};

export default RecipeCatalog;
