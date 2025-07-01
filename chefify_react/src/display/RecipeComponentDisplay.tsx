import React from "react";
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
            {recipeComponents.length > 0 ? (
                recipeComponents.map((component) => (
                    <RecipeComponentCard
                        component={component}
                        updateRecipeComponents={updateRecipeComponents}
                        fetchIngredients={fetchIngredients}
                        setFetchIngredients={setFetchIngredients}
                    />
                ))
            ) : (
                <div>The author has not created any recipe components!</div>
            )}
        </div>
    );
};

export default RecipeComponentDisplay;
