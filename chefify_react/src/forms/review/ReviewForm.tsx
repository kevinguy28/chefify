import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createReview, deleteReview, updateReview } from "@/endpoints/api";

import { ReviewFormProps } from "@/interfaces/interfaces";

const ReviewForm: React.FC<ReviewFormProps> = ({ review, setLoaded }) => {
    const { recipeId } = useParams();
    const [userRating, setUserRating] = useState<number>(0);
    const [userReviewText, setUserReviewText] = useState<string>("");

    const handleDelete = async () => {
        const response = await deleteReview(String(recipeId));

        if (response) {
            setLoaded(false);
            const recipeRatings = document.querySelectorAll(
                "[id^='recipeRating']"
            );
            for (const rating of recipeRatings) {
                const input = rating as HTMLInputElement;
                input.checked = false;
            }
        }
    };

    const handleEdit = async () => {
        const response = await updateReview(
            String(recipeId),
            userRating,
            userReviewText
        );
        if (response) {
            setLoaded(false);
        }
    };

    const handleSubmit = async () => {
        const response = await createReview(
            String(recipeId),
            userRating,
            userReviewText
        );
        if (response) {
            setLoaded(false);
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
        } else {
            setUserReviewText("");
        }
    }, [review]);

    return (
        <div className="w-full p-4 text-sm bg-dark">
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
                    className="w-full p-2 overflow-hidden border rounded-md resize-none"
                    rows={4}
                    value={userReviewText}
                    onChange={(e) => setUserReviewText(e.target.value)}
                ></textarea>
            </div>
            <div className={`flex ${review && "justify-around"}`}>
                <input
                    className={`${
                        !review ? "sm:w-4/5 lg:w-full" : "sm:w-2/5 lg:w-2/5"
                    } py-4 bg-duck-pale-yellow hover:bg-white  text-alt-text rounded-lg`}
                    type="submit"
                    value={review ? "Submit Edits" : "Submit Changes"}
                    onClick={review ? handleEdit : handleSubmit}
                ></input>
                {review && (
                    <input
                        className="py-4 rounded-lg sm:w-2/5 lg:w-2/5 bg-duck-pale-yellow hover:bg-white text-alt-text"
                        type="submit"
                        value="Delete Review"
                        onClick={handleDelete}
                    ></input>
                )}
            </div>
        </div>
    );
};

export default ReviewForm;
