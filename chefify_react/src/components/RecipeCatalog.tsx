import React from "react";
import { RecipeCatalogProps } from "@/interfaces/interfaces";
import RecipeContainer from "./RecipeContainer";

const RecipeCatalog: React.FC<RecipeCatalogProps> = ({
    recipes,
    currentPage,
    hasNext,
    hasPrevious,
    fetchRecipes,
}) => {
    return (
        <div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-6">
                {" "}
                {recipes.map((recipe) => (
                    <div>
                        <RecipeContainer recipe={recipe} edit={false} />
                    </div>
                ))}
            </div>

            <div className="relative flex justify-center my-10 ">
                <span className="relative font-bold">
                    {hasPrevious && (
                        <span
                            className="absolute cursor-pointer right-20"
                            onClick={() => fetchRecipes(currentPage - 1)}
                        >
                            Previous
                        </span>
                    )}
                    {currentPage}
                    {hasNext && (
                        <span
                            className="absolute cursor-pointer left-20"
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
