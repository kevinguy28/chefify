import { useEffect, useState } from "react";
import { createIngredient, updateUserProfile } from "@/endpoints/api";

const ShoppingListForm = () => {
    const [ingredient, setIngredient] = useState<string>("");
    const [ingredientAdd, setIngredientAdd] = useState<string>("");

    const submitIngredient = async () => {
        const response = await createIngredient(ingredient);
        if (response) {
            console.log(response);
        }
    };
    const submitIngredientAdd = async () => {
        const response = await updateUserProfile(ingredientAdd, "true");
        if (response) {
            console.log(response);
        }
    };

    return (
        <div>
            <input
                className="w-full mt-60 p-4 bg-duck-yellow text-alt-text  rounded-xl"
                placeholder="Name of Step"
                type="text"
                onChange={(e) => setIngredient(e.target.value)}
            />
            <div onClick={submitIngredient}>Submit</div>
            <input
                className="w-full mt-60 p-4 bg-duck-yellow text-alt-text  rounded-xl"
                placeholder="Add Ingredient"
                type="text"
                onChange={(e) => setIngredientAdd(e.target.value)}
            />
            <div onClick={submitIngredientAdd}>Add</div>
        </div>
    );
};

export default ShoppingListForm;
