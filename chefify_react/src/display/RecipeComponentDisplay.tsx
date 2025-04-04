import React, { useEffect, useState } from "react";
import { RecipeComponentDisplayProp } from "@/interfaces/interfaces";
import { getRecipeComponent } from "@/endpoints/api";
import RecipeComponentCard from "@/components/RecipeComponentCard";
const RecipeComponentDisplay: React.FC<RecipeComponentDisplayProp> = ({
    recipe,
    updateRecipeComponents,
    recipeComponents,
}) => {
    return (
        <div className="px-4 sm:w-4/5 lg:w-full mx-auto ">
            {recipeComponents &&
                recipeComponents.map((component) => (
                    <RecipeComponentCard
                        component={component}
                        updateRecipeComponents={updateRecipeComponents}
                    />
                ))}
        </div>
    );
};

export default RecipeComponentDisplay;
