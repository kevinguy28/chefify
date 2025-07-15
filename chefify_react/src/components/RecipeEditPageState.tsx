import React from "react";

import { RecipeEditPageStateProp } from "@/interfaces/interfaces";
import { deleteRecipe } from "@/endpoints/api";
import { useNavigate } from "react-router-dom";

const RecipeEditPageState: React.FC<RecipeEditPageStateProp> = ({
    setPageState,
    pageState,
    recipeId,
}) => {
    const navigate = useNavigate();

    const handleDelete = async (recipeId: string) => {
        const response = await deleteRecipe(recipeId);
        if (response) {
            navigate("/recipe/edit-catalog/");
        }
    };

    return (
        <div className="flex justify-center w-full gap-4 p-2 mx-auto rounded-md bg-pepper-green sm:w-160">
            <div
                className={`p-2 text-center  rounded-md bg-dark ${
                    pageState === "editRecipe" && "border-2 border-red-protein"
                }`}
                onClick={() => setPageState("editRecipe")}
            >
                Edit Recipe
            </div>
            <div
                className={`p-2 text-center  rounded-md bg-dark ${
                    pageState === "addStep" && "border-2 border-red-protein"
                }`}
                onClick={() => setPageState("addStep")}
            >
                Add Steps
            </div>
            <div
                className={`p-2 text-center  rounded-md bg-dark ${
                    pageState === "addIngredient" &&
                    "border-2 border-red-protein"
                }`}
                onClick={() => setPageState("addIngredient")}
            >
                Add Ingredients
            </div>
            <div
                className={`p-2 flex text-center rounded-md bg-dark ${
                    pageState === "addIngredient" &&
                    "border-2 border-red-protein"
                }`}
                onClick={() => handleDelete(recipeId)}
            >
                Delete Recipe
            </div>{" "}
        </div>
    );
};

export default RecipeEditPageState;
