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
        <div>
            {recipe && (
                <div className="sm:flex sm:flex-col lg:grid lg:grid-cols-[2fr_4fr_2fr] max-w-screen-xl mx-auto">
                    <div className="xxx p-4 lg:max-h-screen overflow-y-auto scrollbar-custom">
                        <div className="sm:block lg:hidden">
                            <RecipeCard recipe={recipe} />
                        </div>
                        <RecipeEditForm recipe={recipe} setLoaded={setLoaded} />
                    </div>
                    <div className="xxx p-4 max-h-screen overflow-y-auto scrollbar-custom">
                        <div className="sm:hidden lg:block mb-4">
                            <RecipeCard recipe={recipe} />
                        </div>
                        <RecipeStepsDisplay edit={true} />
                    </div>
                    <div>
                        <RecipeStepsForm />
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeEdit;
