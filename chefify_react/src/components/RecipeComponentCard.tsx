import React, { useEffect, useState } from "react";
import { RecipeComponentCardProp } from "@/interfaces/interfaces";
import {
    readRecipeIngredients,
    deleteRecipeComponent,
    deleteRecipeIngredient,
} from "@/endpoints/api";

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
        <div className="bg-dark-light p-2 rounded-xl mb-4">
            <h1 className="font-bold text-xl flex gap-4">{component.name}</h1>
            <p>{component.description}</p>
            <hr />
            <div className="py-4">
                {recipeIngredients &&
                    recipeIngredients.map((ingredient) => (
                        <>
                            <div className="flex justify-between">
                                <div>
                                    {ingredient.quantity} {ingredient.unit} -{" "}
                                    {ingredient.ingredient.name}
                                </div>
                                <div
                                    onClick={() =>
                                        handleDeleteIngredient(ingredient.id)
                                    }
                                >
                                    Delete
                                </div>
                            </div>
                        </>
                    ))}
            </div>

            <hr />
            <div className="flex gap-4 justify-end">
                <div>Edit</div>
                <div onClick={handleDeleteCard}>Delete</div>
            </div>
        </div>
    );
};

export default RecipeComponentCard;
