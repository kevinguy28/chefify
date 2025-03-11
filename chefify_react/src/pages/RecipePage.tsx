import { Recipe } from "@/interfaces/interfaces";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { readRecipe } from "@/endpoints/api";

import RecipeStepsDisplay from "@/display/RecipeStepsDisplay";

const RecipePage = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    const loadData = async () => {
        const response = await readRecipe(String(recipeId));
        if (response) {
            setRecipe(response);
            setLoaded(true);
        }
    };

    useEffect(() => {
        if (!loaded) {
            loadData();
        }
    }, [loaded]);

    return (
        <div>
            {recipe && <>{recipe.name}</>}
            <RecipeStepsDisplay />
        </div>
    );
};

export default RecipePage;
