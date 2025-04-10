import {
    readIngredientUserProfile,
    readRecipeIngredients,
} from "@/endpoints/api";
import React, { useState, useEffect } from "react";
import {
    RecipeIngredient,
    ComponentIngredientProp,
    Ingredient,
} from "@/interfaces/interfaces";

import { convertIngredientType } from "@/functions";

const ComponentIngredientCard: React.FC<ComponentIngredientProp> = ({
    recipeId,
    component,
}) => {
    const [recipeIngredients, setRecipeIngredients] = useState<
        Array<RecipeIngredient>
    >([]);
    const [userIngredientsId, setUserIngredientsId] = useState<Array<any>>([]);

    const fetchRecipeIngredient = async () => {
        const response = await readRecipeIngredients(recipeId, component.id);
        if (response) {
            setRecipeIngredients(response);
        }
    };

    const fetchIngredientUserProfile = async () => {
        const response = await readIngredientUserProfile("true");
        if (response) {
            let flatmap: Array<any> = response.data;
            flatmap = flatmap
                .flatMap((obj) => Object.values(obj)[0])
                .flatMap((ingredient: unknown) => {
                    if (ingredient && typeof ingredient === "object") {
                        const typedIngredient = ingredient as { id: number };
                        return typedIngredient.id;
                    }
                    return [];
                });
            setUserIngredientsId(flatmap);
        }
    };

    useEffect(() => {
        fetchIngredientUserProfile();
    }, []);

    useEffect(() => {
        fetchRecipeIngredient();
    }, [recipeId, component]);

    return (
        <div className="p-4 mb-4 bg-dark rounded-xl max-w-full ">
            <h1 className="text-xl font-bold">{component.name}</h1>
            <hr />
            {recipeIngredients.length > 0 ? (
                recipeIngredients.map((ingredient) => (
                    <div className="w-full flex flex-row justify-between items-center my-1">
                        <div className="flex flex-wrap grow min-w-0 ">
                            <p
                                className={`break-words overflow-hidden ${`${
                                    userIngredientsId.includes(ingredient.id)
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`} `}
                            >
                                {ingredient.ingredient.name} -{" "}
                                {ingredient.quantity} {ingredient.unit}
                            </p>
                        </div>
                        <div className="w-8 h-8  flex-shrink-0">
                            {" "}
                            {convertIngredientType(
                                ingredient.ingredient.ingredientType
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="my-1">
                    There are currently no ingredients listed!
                </div>
            )}
        </div>
    );
};

export default ComponentIngredientCard;
