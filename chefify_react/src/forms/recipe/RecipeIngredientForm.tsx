import React, { useState, useEffect } from "react";
import { createRecipeComponent, createRecipeIngredient } from "@/endpoints/api";
import { RecipeIngredientFormProp } from "@/interfaces/interfaces";

const RecipeIngredientForm: React.FC<RecipeIngredientFormProp> = ({
    recipe,
    recipeComponents,
    updateRecipeComponentsAdd,
    setFetchIngredients,
}) => {
    const UNIT_CHOICES: Record<string, string> = {
        tbsp: "Tablespoon",
        tsp: "Teaspoon",
        cup: "Cup",
        oz: "Ounce",
        g: "Gram",
        kg: "Kilogram",
        ml: "Milliliter",
        L: "Liter",
        pinch: "Pinch",
        dash: "Dash",
    };

    const [quantity, setQuantity] = useState<string>("");
    const [unit, setUnit] = useState<keyof typeof UNIT_CHOICES>("tbsp");
    const [ingredient, setIngredient] = useState<string>("");
    const [ingredientType, setIngredientType] = useState<string>("other");
    const [recipeComponentName, setRecipeComponentName] = useState<string>("");
    const [recipeComponentDescription, setRecipeComponentDescription] =
        useState<string>("");
    const [componentId, setComponentId] = useState<string>("");

    const isValidNumber = (value: string) => {
        const num = parseFloat(value);
        return !isNaN(num) && num > 0;
    };

    const handleSubmitRecipeComponent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (recipeComponentName.length > 0) {
            const response = await createRecipeComponent(
                recipeComponentName,
                recipeComponentDescription,
                recipe.id.toString()
            );
            if (response) {
                updateRecipeComponentsAdd(response);
            }
        } else {
            alert(
                "Please ensure you have given a name to the Recipe Component you are trying to make!"
            );
        }
    };

    const handleSubmitRecipeIngredient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isValidNumber(quantity) && ingredient.length > 0) {
            const response = await createRecipeIngredient(
                parseFloat(quantity),
                unit,
                ingredient,
                ingredientType,
                recipe.id,
                componentId
            );
            if (response) {
                setFetchIngredients(true);
            }
        } else {
            alert(
                "Please ensure your Quantity value is greater than 0, that Ingredient name is not left blank, and that the ingredient is associated with a Recipe Component. If no Recipe Components exist, please create a new one and try again!"
            );
        }
    };

    useEffect(() => {
        if (recipeComponents.length > 0) {
            setComponentId(recipeComponents[0].id.toString());
        }
    }, [recipeComponents]);

    return (
        <div className="flex flex-col justify-center gap-4 p-4 mx-auto sm:w-120">
            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmitRecipeComponent}
            >
                {" "}
                <label className="font-bold">Title: </label>
                <input
                    className="w-full p-4 mx-auto rounded-md bg-dark "
                    placeholder="Type title"
                    type="text"
                    value={recipeComponentName}
                    onChange={(e) => setRecipeComponentName(e.target.value)}
                />
                <label className="font-bold">Description: </label>
                <textarea
                    className="w-full p-4 overflow-hidden border rounded-md resize-none bg-dark"
                    placeholder="Type description "
                    value={recipeComponentDescription}
                    onChange={(e) =>
                        setRecipeComponentDescription(e.target.value)
                    }
                ></textarea>
                <input
                    className="py-2 mx-auto bg-green-600 rounded-lg w-80 h-14 hover:bg-green-700"
                    type="submit"
                    value="Submit Recipe Component"
                />
            </form>

            <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmitRecipeIngredient}
            >
                <label className="font-bold">Quantity: </label>
                <input
                    className="w-full p-4 mx-auto rounded-md bg-dark"
                    placeholder="Select Quantity"
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <label className="font-bold">Measurement: </label>
                <select
                    className="w-full p-4 rounded-md bg-dark"
                    onChange={(e) =>
                        setUnit(e.target.value as keyof typeof UNIT_CHOICES)
                    }
                    value={unit}
                >
                    {Object.entries(UNIT_CHOICES).map(([key, value]) => (
                        <option key={key} value={key}>
                            {value}
                        </option>
                    ))}
                </select>
                <label className="font-bold">Ingredient Name: </label>
                <input
                    className="w-full p-4 rounded-md bg-dark"
                    placeholder="Type name"
                    type="text"
                    onChange={(e) => setIngredient(e.target.value)}
                    value={ingredient}
                />
                <label className="font-bold">Category: </label>
                <select
                    className="w-full p-4 rounded-md bg-dark"
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
                <label className="font-bold">
                    Associated with Recipe Component:{" "}
                </label>
                <select
                    className="w-full p-4 rounded-md bg-dark"
                    name="selectRecipeComponents"
                    onChange={(e) => setComponentId(e.target.value)}
                    value={componentId}
                >
                    {recipeComponents &&
                        recipeComponents.map((comp) => (
                            <option value={comp.id.toString()}>
                                {comp.name}
                            </option>
                        ))}
                </select>
                <input
                    className="py-2 mx-auto bg-green-600 rounded-lg w-80 h-14 hover:bg-green-700"
                    type="submit"
                    value="Submit Changes"
                />
            </form>
        </div>
    );
};

export default RecipeIngredientForm;
