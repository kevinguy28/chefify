import React, { useEffect, useState } from "react";
import { RecipeComponentDisplayProp } from "@/interfaces/interfaces";
import RecipeComponentCard from "@/components/RecipeComponentCard";
const RecipeComponentDisplay: React.FC<RecipeComponentDisplayProp> = ({
    updateRecipeComponents,
    recipeComponents,
    fetchIngredients,
    setFetchIngredients,
}) => {
    return (
        <div className="px-4 sm:w-4/5 lg:w-full mx-auto ">
            {recipeComponents &&
                recipeComponents.map((component) => (
                    <RecipeComponentCard
                        component={component}
                        updateRecipeComponents={updateRecipeComponents}
                        fetchIngredients={fetchIngredients}
                        setFetchIngredients={setFetchIngredients}
                    />
                ))}
        </div>
    );
};

export default RecipeComponentDisplay;
