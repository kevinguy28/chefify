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
            console.log(response);
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
        <div className="grid grid-cols-[3fr_3fr_5fr]">
            <RecipeEditForm />
            <RecipeStepsForm />
            <div>
                {recipe && (
                    <RecipeCard
                        user={recipe.user}
                        id={recipe.id}
                        name={recipe.name}
                        cuisine={recipe.cuisine}
                        privacy={recipe.privacy}
                        description={recipe.description}
                        image={recipe.image}
                    />
                )}
                <RecipeStepsDisplay />
            </div>
        </div>
    );
};

export default RecipeEdit;
