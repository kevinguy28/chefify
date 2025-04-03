import { useState } from "react";
import { updateIngredientUserProfile } from "@/endpoints/api";
import { ShoppingListFormProp } from "@/interfaces/interfaces";

const ShoppingListForm: React.FC<ShoppingListFormProp> = ({
    isOwned,
    setLoaded,
}) => {
    const [ingredientAdd, setIngredientAdd] = useState<string>("");
    const [ingredientType, setIngredientType] = useState<string>("other");

    const submitIngredientAdd = async () => {
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
            setLoaded(false);
        }
    };

    return (
        <div className="h-auto bg-bg p-4 rounded-lg">
            <input
                className="w-1/1 p-4 bg-dark-light text-white rounded-xl"
                placeholder="Add Ingredient"
                type="text"
                onChange={(e) => setIngredientAdd(e.target.value)}
            />
            <form className="flex gap-4 mt-4">
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

                <input
                    className="bg-pepper-green w-1/5 py-2 rounded-lg flex items-center justify-center text-center"
                    onClick={submitIngredientAdd}
                    defaultValue={"Add"}
                ></input>
            </form>
        </div>
    );
};

export default ShoppingListForm;
