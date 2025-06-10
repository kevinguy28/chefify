import { Recipe, Review } from "@/interfaces/interfaces";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    readRecipe,
    readReviewUser,
    readRecipeComponent,
} from "@/endpoints/api";

import ComponentIngredientCard from "@/components/ComponentIngredientCard";
import RecipeStepsDisplay from "@/display/RecipeStepsDisplay";
import RecipeCard from "@/components/RecipeCard";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/forms/review/ReviewForm";
import RecipeReviewDisplay from "@/display/RecipeReviewDisplay";

const RecipePage = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [review, setReview] = useState<Review | null>(null);
    const [recipeComponent, setRecipeComponent] = useState<Array<any>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    const loadData = async () => {
        const responseRecipe = await readRecipe(String(recipeId));
        if (responseRecipe) {
            setRecipe(responseRecipe);
        }
        const responseReview = await readReviewUser(String(recipeId), "false");
        if (responseReview.data) {
            setReview(responseReview.data);
        }
        const responseRecipeComponent = await readRecipeComponent(
            String(recipeId)
        );
        if (responseRecipeComponent) {
            setRecipeComponent(responseRecipeComponent);
        }
        setLoaded(true);
    };

    useEffect(() => {
        if (!loaded) {
            loadData();
        }
    }, [loaded]);

    return (
        <div className="flex-col max-w-screen-xl grid-cols-2 gap-4 mx-auto sm:flex xl:grid">
            <div className="flex flex-col gap-4">
                <div className="mx-auto mt-16 sm:w-120 lg:w-150 bg-dark ">
                    <img
                        className="w-full sm:h-60 lg:h-90"
                        alt={recipe?.name ?? "Recipe Image"}
                        src={
                            recipe?.image
                                ? `http://localhost:8000${recipe.image}`
                                : `http://localhost:8000/media/images/recipes/default-recipe.png`
                        }
                    />

                    <div className="flex flex-col gap-2 p-4 ">
                        <h1 className="text-lg font-bold">{recipe?.name}</h1>
                        <p className="text-sm">
                            {recipe?.cuisine.name} | {recipe?.user.username}
                        </p>
                        <ReviewCard
                            reviewUser={undefined}
                            reviewRating={recipe?.rating}
                            reviewText={undefined}
                            isUserReview={false}
                        />

                        <p className="text-sm text-darker-text">
                            {recipe?.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center min-w-0 mx-auto sm:gap-4 lg:gap-8 sm:w-120 lg:w-150">
                    {loaded &&
                        recipeComponent.map((component) => (
                            <ComponentIngredientCard
                                recipeId={Number(recipeId)}
                                component={component}
                            />
                        ))}
                </div>
            </div>

            <div>{loaded && <RecipeStepsDisplay edit={false} />}</div>
            <div className="flex flex-col gap-4">
                <div className="mx-auto sm:w-120 lg:w-150">
                    {loaded && review ? (
                        <ReviewForm review={review} setLoaded={setLoaded} />
                    ) : (
                        <ReviewForm review={null} setLoaded={setLoaded} />
                    )}
                </div>

                <div className="mx-auto sm:w-120 lg:w-150">
                    {loaded && recipe && (
                        <RecipeReviewDisplay recipe={recipe} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipePage;
