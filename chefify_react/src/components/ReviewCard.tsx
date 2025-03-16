import React, { useEffect } from "react";
import { ReviewCardProps } from "@/interfaces/interfaces";
import "@/styles/css/reviewCard.css";

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    useEffect(() => {
        if (review) {
            const ratingValue = review.rating * 2;
            const recipeRating: HTMLInputElement = document.getElementById(
                `reviewCardRating${ratingValue}`
            ) as HTMLInputElement;
            recipeRating.checked = true;
        }
    }, [review]);

    return (
        <div className="bg-dark p-4 rounded-xl">
            <div className="flex justify-between items-center">
                <h1>{review?.user.username} review</h1>
                <fieldset
                    className="rateReviewCard pointer-events-none "
                    name="userReview"
                >
                    <input
                        type="radio"
                        id="reviewCardRating10"
                        name="userReview"
                        value="5.0"
                    />
                    <label
                        className="label"
                        htmlFor="reviewCardRating10"
                        title="5 stars"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating9"
                        name="userReview"
                        value="4.5"
                    />
                    <label
                        className="half label"
                        htmlFor="reviewCardRating9"
                        title="4 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating8"
                        name="userReview"
                        value="4.0"
                    />
                    <label
                        className="label"
                        htmlFor="reviewCardRating8"
                        title="4 stars"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating7"
                        name="userReview"
                        value="3.5"
                    />
                    <label
                        className="half label"
                        htmlFor="reviewCardRating7"
                        title="3 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating6"
                        name="userReview"
                        value="3.0"
                    />
                    <label
                        className="label"
                        htmlFor="reviewCardRating6"
                        title="3 stars"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating5"
                        name="userReview"
                        value="2.5"
                    />
                    <label
                        className="half label"
                        htmlFor="reviewCardRating5"
                        title="2 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating4"
                        name="userReview"
                        value="2.0"
                    />
                    <label
                        className="label"
                        htmlFor="reviewCardRating4"
                        title="2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating3"
                        name="userReview"
                        value="1.5"
                    />
                    <label
                        className="half label"
                        htmlFor="reviewCardRating3"
                        title="1 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating2"
                        name="userReview"
                        value="1.0"
                    />
                    <label
                        className="label"
                        htmlFor="reviewCardRating2"
                        title="1 star"
                    ></label>
                    <input
                        type="radio"
                        id="reviewCardRating1"
                        name="userReview"
                        value="0.5"
                    />
                    <label
                        className="half label"
                        htmlFor="reviewCardRating1"
                        title="1/2 star"
                    ></label>
                </fieldset>
            </div>

            <p className="bg-bg p-2 rounded-sm text-darker-text text-sm">
                {review?.review_text || "No review available"}
            </p>
        </div>
    );
};

export default ReviewCard;
