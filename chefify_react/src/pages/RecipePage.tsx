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
        <div className="lg:grid lg:grid-cols-[1fr_2fr_1fr] max-w-screen-xl mx-auto ">
            <div className="mt-4 flex flex-col gap-4 min-w-0">
                {loaded && (
                    <>
                        <RecipeCard
                            recipe={recipe}
                            traverseMode={false}
                            editMode={false}
                        />
                        {loaded && (
                            <ReviewCard
                                reviewUser={undefined}
                                reviewRating={recipe?.rating}
                                reviewText={undefined}
                                isUserReview={false}
                            />
                        )}
                        <ReviewCard
                            reviewUser={review?.user}
                            reviewRating={review?.rating}
                            reviewText={review?.review_text}
                            isUserReview={true}
                        />
                    </>
                )}

                {loaded && review ? (
                    <ReviewForm review={review} setLoaded={setLoaded} />
                ) : (
                    <ReviewForm review={null} setLoaded={setLoaded} />
                )}
                {loaded && recipe && <RecipeReviewDisplay recipe={recipe} />}
            </div>
            <div className="mt-4 min-w-0">
                {loaded && <RecipeStepsDisplay edit={false} />}
            </div>
            <div className="mt-4 min-w-0">
                {loaded &&
                    recipeComponent.map((component) => (
                        <ComponentIngredientCard
                            recipeId={Number(recipeId)}
                            component={component}
                        />
                    ))}
            </div>
        </div>
    );
};

export default RecipePage;
