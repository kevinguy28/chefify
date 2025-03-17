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
                <RecipeCard recipe={recipe} />
                <ReviewCard review={review} recipe={null} />
                {review ? (
                    <ReviewForm
                        review={review}
                        setReview={setReview}
                        setLoaded={setLoaded}
                    />
                ) : (
                    <ReviewForm
                        review={null}
                        setReview={setReview}
                        setLoaded={setLoaded}
                    />
                )}
            </div>
            <div className="mt-4">
                <RecipeStepsDisplay edit={false} />
            </div>
            <div className="mt-4">
                <ReviewCard review={null} recipe={recipe} />
            </div>
        </div>
    );
};

export default RecipePage;
