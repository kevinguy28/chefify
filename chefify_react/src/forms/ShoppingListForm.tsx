import { useEffect, useState } from "react";
import {
    createIngredient,
    updateIngredientUserProfile,
    deleteIngredientUserProfile,
} from "@/endpoints/api";
import { ShoppingListFormProp } from "@/interfaces/interfaces";

const ShoppingListForm: React.FC<ShoppingListFormProp> = ({
    isOwned,
    setLoaded,
}) => {
    const [ingredientAdd, setIngredientAdd] = useState<string>("");
    const [ingredientType, setIngredientType] = useState<string>("other");

    const submitIngredientAdd = async () => {
        setLoaded(false);
        if (ingredientAdd.length === 0) {
            alert("Please make sure the Ingredient you're adding has a name!");
            return;
        }
        const response = await updateIngredientUserProfile(
            ingredientAdd,
            ingredientType,
            isOwned.toString()
        );
        if (response) {
            console.log("xp");
            setLoaded(false);
        }
    };

    return (
        <div className="h-auto">
            <input
                className="w-1/1 p-4 bg-dark-light text-white rounded-xl"
                placeholder="Add Ingredient"
                type="text"
                onChange={(e) => setIngredientAdd(e.target.value)}
            />
            <div className="flex gap-4 mt-4">
                <select
                    className="w-4/5 p-4 bg-dark-light rounded-xl"
                    name="selectIngredientType"
                    onChange={(e) => setIngredientType(e.target.value)}
                    value={ingredientType}
                >
                    <option value="other">Other</option>
                    <option value="dairy">Dairy</option>
                    <option value="fruitsVegetables">
                        Fruits & Vegetables
                    </option>
                    <option value="grains">Grains</option>
                    <option value="herbsSpices">Herbs & Spices</option>
                    <option value="protein">Protein</option>
                </select>

                <div
                    className="bg-pepper-green w-1/5 py-2 rounded-lg flex items-center justify-center"
                    onClick={submitIngredientAdd}
                >
                    Add
                </div>
            </div>
        </div>
    );
};

export default ShoppingListForm;
