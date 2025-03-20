import React from "react";
import RecipeCard from "./RecipeCard";
import { RecipeCatalogProps } from "@/interfaces/interfaces";

const RecipeCatalog: React.FC<RecipeCatalogProps> = ({
    recipes,
    currentPage,
    hasNext,
    hasPrevious,
    editMode,
    fetchRecipes,
}) => {
    return (
        <div>
            <div className="flex flex-wrap gap-y-4 justify-evenly items-center">
                {recipes &&
                    recipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            traverseMode={true}
                            editMode={editMode}
                        />
                    ))}
            </div>

            <div className="relative flex justify-center my-10 ">
                <span className="font-bold relative">
                    {hasPrevious && (
                        <span
                            className="absolute right-20 cursor-pointer"
                            onClick={() => fetchRecipes(currentPage - 1)}
                        >
                            Previous
                        </span>
                    )}
                    {currentPage}
                    {hasNext && (
                        <span
                            className="absolute left-20 cursor-pointer"
                            onClick={() => fetchRecipes(currentPage + 1)}
                        >
                            Next
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default RecipeCatalog;
