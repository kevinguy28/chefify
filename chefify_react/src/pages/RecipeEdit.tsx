import { useState, useEffect } from "react";
import RecipeEditForm from "@/forms/recipe/RecipeEditForm";
import RecipeStepsForm from "@/forms/recipe/RecipeStepsForm";
import RecipeStepsDisplay from "@/display/RecipeStepsDisplay";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/interfaces/interfaces";
import { readRecipe } from "@/endpoints/api";
import { useParams } from "react-router-dom";
import RecipeIngredientForm from "@/forms/recipe/RecipeIngredientForm";
import RecipeComponentDisplay from "@/display/RecipeComponentDisplay";

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
                <div className="sm:flex sm:flex-col lg:grid lg:grid-cols-[3fr_4fr_3fr] max-w-screen-xl mx-auto">
                    <div className="scrollbar p-4 lg:max-h-screen overflow-y-auto ">
                        <div className="sm:block lg:hidden">
                            <RecipeCard
                                recipe={recipe}
                                traverseMode={false}
                                editMode={false}
                            />
                        </div>
                        <RecipeEditForm recipe={recipe} setLoaded={setLoaded} />
                    </div>
                    <div className="scrollbar p-4 max-h-screen overflow-y-auto ">
                        <div className="sm:hidden lg:block mb-4">
                            <RecipeCard
                                recipe={recipe}
                                traverseMode={false}
                                editMode={false}
                            />
                        </div>
                        <RecipeComponentDisplay recipe={recipe} />
                        <RecipeStepsDisplay edit={true} />
                    </div>
                    <div>
                        <RecipeStepsForm />

                        {recipe && <RecipeIngredientForm recipe={recipe} />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeEdit;
