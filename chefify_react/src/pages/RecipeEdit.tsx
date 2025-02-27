import React, { useEffect, useState } from "react";
import { getRecipe } from "@/endpoints/api";
import { useParams } from "react-router-dom";

const RecipeEdit = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<any>(null);
    const [loaded, setLoad] = useState<Boolean>(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            const retrievedRecipe = await getRecipe(String(recipeId));

            if (retrievedRecipe) {
                setRecipe(retrievedRecipe);
                setLoad(true);
            } else {
                console.error("No valid recipe found!");
            }
        };
        if (!loaded) {
            fetchRecipe();
        }
    }, [loaded]);

    return (
        <div>
            <div>{recipe?.name}</div>
            <h1>hello</h1>
        </div>
    );
};

export default RecipeEdit;
