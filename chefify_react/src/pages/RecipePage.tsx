import { Recipe, Review } from "@/interfaces/interfaces";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { readRecipe, createReview, readReview } from "@/endpoints/api";

import RecipeStepsDisplay from "@/display/RecipeStepsDisplay";
import RecipeCard from "@/components/RecipeCard";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/forms/review/ReviewForm";

const RecipePage = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [review, setReview] = useState<Review | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    const loadData = async () => {
        const responseRecipe = await readRecipe(String(recipeId));
        if (responseRecipe) {
            setRecipe(responseRecipe);
        }
        const responseReview = await readReview(String(recipeId));
        if (responseReview.data) {
            setReview(responseReview.data);
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
            <div className="mt-4 flex flex-col gap-4">
                {loaded && (
                    <>
                        <RecipeCard
                            recipe={recipe}
                            traverseMode={false}
                            editMode={false}
                        />
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
            </div>
            <div className="mt-4">
                {loaded && <RecipeStepsDisplay edit={false} />}
            </div>
            <div className="mt-4">
                {loaded && (
                    <ReviewCard
                        reviewUser={undefined}
                        reviewRating={recipe?.rating}
                        reviewText={undefined}
                        isUserReview={false}
                    />
                )}
            </div>
        </div>
    );
};

export default RecipePage;
