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
                "Please ensure your Quantity value is greater than 0 and that Ingredient name is not left blank!"
            );
        }
    };

    useEffect(() => {
        if (recipeComponents.length > 0) {
            setComponentId(recipeComponents[0].id.toString());
        }
    }, [recipeComponents]);

    return (
        <>
            <form className="space-y-4" onSubmit={handleSubmitRecipeComponent}>
                {" "}
                <input
                    className="w-4/5 p-4 bg-duck-yellow rounded-xl mx-auto text-alt-text"
                    placeholder="Select Quantity"
                    type="text"
                    value={recipeComponentName}
                    onChange={(e) => setRecipeComponentName(e.target.value)}
                />
                <textarea
                    className="w-full p-2 border rounded-md resize-none overflow-hidden"
                    value={recipeComponentDescription}
                    onChange={(e) =>
                        setRecipeComponentDescription(e.target.value)
                    }
                ></textarea>
                <input
                    className="sm:w-4/5 lg:w-full py-4 bg-duck-pale-yellow hover:bg-white  text-alt-text rounded-lg mx-auto"
                    type="submit"
                    value="Submit Recipe Component"
                />
            </form>

            <form className="space-y-4" onSubmit={handleSubmitRecipeIngredient}>
                <input
                    className="w-4/5 p-4 bg-duck-yellow rounded-xl mx-auto text-alt-text"
                    placeholder="Select Quantity"
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />
                <select
                    className="w-4/5 p-4 bg-duck-yellow text-alt-text rounded-xl"
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
                <input
                    className="w-4/5 p-4 bg-duck-yellow text-alt-text rounded-xl"
                    type="text"
                    onChange={(e) => setIngredient(e.target.value)}
                    value={ingredient}
                />
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
                <select
                    className="w-4/5 p-4 bg-dark-light rounded-xl"
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
                    className="sm:w-4/5 lg:w-full py-4 bg-duck-pale-yellow hover:bg-white  text-alt-text rounded-lg mx-auto"
                    type="submit"
                    value="Submit Changes"
                />
            </form>
        </>
    );
};

export default RecipeIngredientForm;
