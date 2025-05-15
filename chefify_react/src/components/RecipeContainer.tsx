import React from "react";
import { RecipeContainerProp } from "@/interfaces/interfaces";

const RecipeContainer: React.FC<RecipeContainerProp> = ({ recipe }) => {
    const formattedDate = recipe.created
        ? new Date(recipe.created).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "Unknown";

    return (
        <div className="max-w-100 w-100 h-35 p-2 mb-2 flex items-center bg-dark-light ">
            <img
                className="w-30 h-30"
                alt={recipe?.name ?? "Recipe Image"}
                src={
                    recipe?.image
                        ? `http://localhost:8000${recipe.image}`
                        : `http://localhost:8000/media/images/recipes/default-recipe.png`
                }
            />
            <div className="bg-blue-500 w-full h-full">
                {formattedDate}
                <h1>{recipe.name}</h1>
            </div>
        </div>
    );
};

export default RecipeContainer;
