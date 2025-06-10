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
        <div className="p-4 bg-dark sm:w-58 lg:w-71 ">
            <h1 className="font-bold text-md">{component.name}</h1>
            {recipeIngredients.length > 0 ? (
                recipeIngredients.map((ingredient) => (
                    <div className="flex flex-row items-center justify-between w-full my-1">
                        <div className="flex flex-wrap min-w-0 grow ">
                            <p
                                className={`text-sm break-words overflow-hidden ${`${
                                    userIngredientsId.includes(ingredient.id)
                                        ? "text-green-400"
                                        : "text-red-400"
                                }`} `}
                            >
                                {ingredient.ingredient.name} -{" "}
                                {ingredient.quantity} {ingredient.unit}
                            </p>
                        </div>
                        <div className="flex-shrink-0 w-8 h-8">
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
