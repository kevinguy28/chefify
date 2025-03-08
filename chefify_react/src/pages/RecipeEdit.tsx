import { useState, useEffect } from "react";
import RecipeEditForm from "@/forms/recipe/RecipeEditForm";
import RecipeStepsForm from "@/forms/recipe/RecipeStepsForm";
import RecipeStepsDisplay from "@/display/RecipeStepsDisplay";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/interfaces/interfaces";
import { readRecipe } from "@/endpoints/api";
import { useParams } from "react-router-dom";

const RecipeEdit = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    const fetchRecipe = async () => {
        const response = await readRecipe(String(recipeId));
        if (response) {
            setRecipe(response);
            setLoaded(true);
        }
    };

    useEffect(() => {
        if (!loaded) {
            fetchRecipe();
        }
    }, [loaded]);

    return (
        <div className="grid grid-cols-[3fr_5fr_3fr]">
            {recipe && (
                <>
                    <RecipeEditForm recipe={recipe} setLoaded={setLoaded} />
                    <div className="p-4">
                        <RecipeCard recipe={recipe} />
                        <RecipeStepsDisplay />
                    </div>
                    <RecipeStepsForm />
                </>
            )}
        </div>
    );
};

export default RecipeEdit;
