import React from "react";

import { RecipeEditPageStateProp } from "@/interfaces/interfaces";

const RecipeEditPageState: React.FC<RecipeEditPageStateProp> = ({
    setPageState,
    pageState,
}) => {
    return (
        <div className="flex justify-center w-full gap-4 p-2 mx-auto rounded-md bg-pepper-green sm:w-120">
            <div
                className={`p-2 rounded-md bg-dark ${
                    pageState === "editRecipe" && "border-2 border-red-protein"
                }`}
                onClick={() => setPageState("editRecipe")}
            >
                Edit Recipe Info
            </div>
            <div
                className={`p-2 rounded-md bg-dark ${
                    pageState === "addStep" && "border-2 border-red-protein"
                }`}
                onClick={() => setPageState("addStep")}
            >
                Add Steps
            </div>
            <div
                className={`p-2 rounded-md bg-dark ${
                    pageState === "addIngredient" &&
                    "border-2 border-red-protein"
                }`}
                onClick={() => setPageState("addIngredient")}
            >
                Add Ingredients
            </div>
        </div>
    );
};

export default RecipeEditPageState;
