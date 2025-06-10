import React, { useEffect, useState } from "react";
import { RecipeComponentCardProp } from "@/interfaces/interfaces";
import {
    readRecipeIngredients,
    deleteRecipeComponent,
    deleteRecipeIngredient,
} from "@/endpoints/api";

import TrashLogo from "@/assets/trash.svg?react";
import XLogo from "@/assets/x.svg?react";

const RecipeComponentCard: React.FC<RecipeComponentCardProp> = ({
    component,
    updateRecipeComponents,
    fetchIngredients,
    setFetchIngredients,
}) => {
    const [recipeIngredients, setRecipeIngredients] = useState<Array<any>>([]);

    const fetchRecipeIngredients = async () => {
        const response = await readRecipeIngredients(
            component.recipe.id,
            component.id
        );
        if (response) {
            setRecipeIngredients(response);
        }
    };

    const handleDeleteCard = async () => {
        const response = await deleteRecipeComponent(component.id.toString());
        if (response) {
            updateRecipeComponents(component.id);
        }
    };

    const handleDeleteIngredient = async (ingredientId: number) => {
        const response = await deleteRecipeIngredient(ingredientId);
        if (response) {
            setRecipeIngredients(
                recipeIngredients.filter(
                    (ingredient) => ingredient.id !== ingredientId
                )
            );
        }
    };

    useEffect(() => {
        fetchRecipeIngredients();
    }, []);

    useEffect(() => {
        if (fetchIngredients === true) {
            fetchRecipeIngredients();
            setFetchIngredients(false);
        }
    }, [fetchIngredients]);

    return (
        <div className="flex flex-col gap-2 p-4 mx-auto bg-dark-light sm:w-110">
            <div>
                <h1 className="text-lg font-bold ">{component.name}</h1>
                <p className="font-light text-md">{component.description}</p>
                <hr />
            </div>

            <div className="flex flex-col">
                {recipeIngredients && recipeIngredients.length > 0 ? (
                    recipeIngredients.map((ingredient) => (
                        <div
                            key={ingredient.id}
                            className="flex items-center justify-between p-2 hover:bg-dark-light"
                        >
                            <div>
                                {ingredient.quantity} {ingredient.unit} |{" "}
                                {ingredient.ingredient.name}
                            </div>
                            <XLogo
                                className="w-6 h-6 hover:text-red-400"
                                onClick={() =>
                                    handleDeleteIngredient(ingredient.id)
                                }
                            />
                        </div>
                    ))
                ) : (
                    <div>No ingredients have been listed yet!</div>
                )}
            </div>
            <div className="flex justify-end w-full ">
                <TrashLogo
                    className="w-10 h-10 hover:text-red-600"
                    onClick={handleDeleteCard}
                />
            </div>
        </div>
    );
};

export default RecipeComponentCard;
