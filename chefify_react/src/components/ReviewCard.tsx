import React, { useEffect } from "react";
import { ReviewCardProps } from "@/interfaces/interfaces";
import "@/styles/css/reviewCard.css";

const ReviewCard: React.FC<ReviewCardProps> = ({ review, recipe }) => {
    useEffect(() => {
        if (review) {
            const ratingValue = review.rating * 2;
            const recipeRating: HTMLInputElement = document.getElementById(
                `reviewCardUserRating${ratingValue}`
            ) as HTMLInputElement;
            recipeRating.checked = true;
        } else {
            const recipeRatings = document.querySelectorAll(
                "[id^='reviewCardUserRating']"
            );
            for (const rating of recipeRatings) {
                const input = rating as HTMLInputElement;
                input.checked = false;
            }

            if (recipe) {
                const recipeRatings = document.querySelectorAll(
                    "[id^='reviewCardPublicRating']"
                );
                for (const rating of recipeRatings) {
                    const input = rating as HTMLInputElement;
                    input.checked = false;
                }
                const ratingValuePublic = recipe.rating * 2;
                console.log(recipe.rating);
                const recipeRatingPublic: HTMLInputElement =
                    document.getElementById(
                        `reviewCardPublicRating${ratingValuePublic}`
                    ) as HTMLInputElement;

                console.log("XXXXXXXXXX");
                console.log(recipeRatingPublic);
                recipeRatingPublic.checked = true;
            }
        }
    }, [review, recipe]);

    return (
        <div className="bg-dark p-4 rounded-xl">
            {review?.rating}
            {recipe?.rating}
            <div className="flex justify-between items-center">
                {review ? (
                    <h1>
                        {review ? review.user.username : "No "} review{" "}
                        {!review && "yet"}
                    </h1>
                ) : (
                    <h1>Public Rating</h1>
                )}
                <fieldset
                    className="rateReviewCard pointer-events-none "
                    name={`${review ? "userReview" : "recipeRatingPublic"}`}
                >
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating10"
                                : "reviewCardPublicRating10"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="5.0"
                    />
                    <label
                        className="label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating10"
                                : "reviewCardPublicRating10"
                        }`}
                        title="5 stars"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating9"
                                : "reviewCardPublicRating9"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="4.5"
                    />
                    <label
                        className="half label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating9"
                                : "reviewCardPublicRating9"
                        }`}
                        title="4 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating8"
                                : "reviewCardPublicRating8"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="4.0"
                    />
                    <label
                        className="label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating8"
                                : "reviewCardPublicRating8"
                        }`}
                        title="4 stars"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating7"
                                : "reviewCardPublicRating7"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="3.5"
                    />
                    <label
                        className="half label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating7"
                                : "reviewCardPublicRating7"
                        }`}
                        title="3 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating6"
                                : "reviewCardPublicRating6"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="3.0"
                    />
                    <label
                        className="label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating6"
                                : "reviewCardPublicRating6"
                        }`}
                        title="3 stars"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating5"
                                : "reviewCardPublicRating5"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="2.5"
                    />
                    <label
                        className="half label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating5"
                                : "reviewCardPublicRating5"
                        }`}
                        title="2 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating4"
                                : "reviewCardPublicRating4"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="2.0"
                    />
                    <label
                        className="label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating4"
                                : "reviewCardPublicRating4"
                        }`}
                        title="2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating3"
                                : "reviewCardPublicRating3"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="1.5"
                    />
                    <label
                        className="half label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating3"
                                : "reviewCardPublicRating3"
                        }`}
                        title="1 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating2"
                                : "reviewCardPublicRating2"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="1.0"
                    />
                    <label
                        className="label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating2"
                                : "reviewCardPublicRating2"
                        }`}
                        title="1 star"
                    ></label>
                    <input
                        type="radio"
                        id={`${
                            review
                                ? "reviewCardUserRating1"
                                : "reviewCardPublicRating1"
                        }`}
                        name={`${review ? "userReview" : "recipeRatingPublic"}`}
                        value="0.5"
                    />
                    <label
                        className="half label"
                        htmlFor={`${
                            review
                                ? "reviewCardUserRating1"
                                : "reviewCardPublicRating1"
                        }`}
                        title="1/2 star"
                    ></label>
                </fieldset>
            </div>
            {review && (
                <p className="bg-bg p-2 rounded-sm text-darker-text text-sm">
                    {review?.review_text || "No review available"}
                </p>
            )}
        </div>
    );
};

export default ReviewCard;
