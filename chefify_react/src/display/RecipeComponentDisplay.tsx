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
        <div className="flex flex-col w-full gap-4 p-4 mx-auto sm:w-120">
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
