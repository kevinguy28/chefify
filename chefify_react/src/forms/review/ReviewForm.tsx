import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createReview, updateReview } from "@/endpoints/api";

import { ReviewFormProps } from "@/interfaces/interfaces";

const ReviewForm: React.FC<ReviewFormProps> = ({ review, setReview }) => {
    const { recipeId } = useParams();
    const [userRating, setUserRating] = useState<number>(0);
    const [userReviewText, setUserReviewText] = useState<string>("");

    const handleEdit = async () => {
        const response = await updateReview(
            String(recipeId),
            userRating,
            userReviewText
        );
        if (response) {
            setReview(response.data);
        }
    };

    const handleSubmit = async () => {
        const response = await createReview(
            String(recipeId),
            userRating,
            userReviewText
        );
        if (response) {
            setReview(response.data);
            console.log("Updated review:", response.data); // Debugging
        }
    };

    useEffect(() => {
        if (review) {
            setUserRating(review.rating);
            setUserReviewText(review.review_text);
            const ratingValue = review.rating * 2;
            const recipeRating: HTMLInputElement = document.getElementById(
                `recipeRating${ratingValue}`
            ) as HTMLInputElement;
            recipeRating.checked = true;
        }
    }, [review]);

    return (
        <div className="bg-dark p-4 rounded-xl">
            <h1>
                {review
                    ? "Edit your review!"
                    : "Leave a review for the recipe!"}
            </h1>
            <div className="flex flex-col items-center mb-4">
                <fieldset
                    className="rate"
                    onChange={(e: React.FormEvent<HTMLFieldSetElement>) => {
                        const target = e.target as HTMLInputElement;
                        setUserRating(parseFloat(target.value));
                    }}
                    name="averageReview"
                >
                    <input
                        type="radio"
                        id="recipeRating10"
                        name="averageReview"
                        value="5.0"
                    />
                    <label
                        className="label"
                        htmlFor="recipeRating10"
                        title="5 stars"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating9"
                        name="averageReview"
                        value="4.5"
                    />
                    <label
                        className="half label"
                        htmlFor="recipeRating9"
                        title="4 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating8"
                        name="averageReview"
                        value="4.0"
                    />
                    <label
                        className="label"
                        htmlFor="recipeRating8"
                        title="4 stars"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating7"
                        name="averageReview"
                        value="3.5"
                    />
                    <label
                        className="half label"
                        htmlFor="recipeRating7"
                        title="3 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating6"
                        name="averageReview"
                        value="3.0"
                    />
                    <label
                        className="label"
                        htmlFor="recipeRating6"
                        title="3 stars"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating5"
                        name="averageReview"
                        value="2.5"
                    />
                    <label
                        className="half label"
                        htmlFor="recipeRating5"
                        title="2 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating4"
                        name="averageReview"
                        value="2.0"
                    />
                    <label
                        className="label"
                        htmlFor="recipeRating4"
                        title="2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating3"
                        name="averageReview"
                        value="1.5"
                    />
                    <label
                        className="half label"
                        htmlFor="recipeRating3"
                        title="1 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating2"
                        name="averageReview"
                        value="1.0"
                    />
                    <label
                        className="label"
                        htmlFor="recipeRating2"
                        title="1 star"
                    ></label>
                    <input
                        type="radio"
                        id="recipeRating1"
                        name="averageReview"
                        value="0.5"
                    />
                    <label
                        className="half label"
                        htmlFor="recipeRating1"
                        title="1/2 star"
                    ></label>
                </fieldset>
                <textarea
                    className="w-full p-2 border rounded-md resize-none overflow-hidden"
                    rows={4}
                    value={userReviewText}
                    onChange={(e) => setUserReviewText(e.target.value)}
                ></textarea>
            </div>
            <input
                className="sm:w-4/5 lg:w-full py-4 bg-duck-pale-yellow hover:bg-white  text-alt-text rounded-lg mx-auto"
                type="submit"
                value={review ? "Submit Edits" : "Submit Changes"}
                onClick={review ? handleEdit : handleSubmit}
            />
        </div>
    );
};

export default ReviewForm;
