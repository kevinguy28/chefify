import React, { useEffect } from "react";
import { ReviewCardProps } from "@/interfaces/interfaces";
import "@/styles/css/reviewCard.css";

const ReviewCard: React.FC<ReviewCardProps> = ({
    reviewUser,
    reviewRating,
    reviewText,
    isUserReview,
}) => {
    useEffect(() => {
        // Public Rating
        if (!isUserReview) {
            if (reviewRating) {
                const publicRating = reviewRating * 2;
                const publicReview = document.getElementById(
                    `publicRating-${publicRating}`
                ) as HTMLInputElement;
                if (publicReview) {
                    publicReview.checked = true;
                }
            }
            // User Rating
        } else {
            if (reviewUser && reviewRating) {
                const userRating = reviewRating * 2;
                const userReview = document.getElementById(
                    `userRating-${reviewUser.id}-${userRating}`
                ) as HTMLInputElement;
                if (userReview) {
                    userReview.checked = true;
                }
            }
        }
    }, [reviewUser, reviewRating, reviewText]);

    return (
        <div className="">
            <div className="flex items-center">
                {!isUserReview && <h1 className="text-sm">Public Review | </h1>}
                {isUserReview && (
                    <h1 className="truncate max-w-[10rem]">
                        {typeof reviewUser === "object"
                            ? `${reviewUser.username} `
                            : "No "}{" "}
                        review
                    </h1>
                )}
                <fieldset className="pointer-events-none rateReviewCard ">
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-10"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-10`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="5.0"
                    />
                    <label
                        className="label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-10"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-10`
                                : undefined
                        }
                        title="5 stars"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-9"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-9`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="4.5"
                    />
                    <label
                        className="half label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-9"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-9`
                                : undefined
                        }
                        title="4 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-8"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-8`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="4.0"
                    />
                    <label
                        className="label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-8"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-8`
                                : undefined
                        }
                        title="4 stars"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-7"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-7`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="3.5"
                    />
                    <label
                        className="half label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-7"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-7`
                                : undefined
                        }
                        title="3 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-6"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-6`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="3.0"
                    />
                    <label
                        className="label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-6"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-6`
                                : undefined
                        }
                        title="3 stars"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-5"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-5`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="2.5"
                    />
                    <label
                        className="half label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-5"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-5`
                                : undefined
                        }
                        title="2 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-4"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-4`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="2.0"
                    />
                    <label
                        className="label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-4"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-4`
                                : undefined
                        }
                        title="2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-3"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-3`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="1.5"
                    />
                    <label
                        className="half label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-3"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-3`
                                : undefined
                        }
                        title="1 1/2 stars"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-2"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-2`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="1.0"
                    />
                    <label
                        className="label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-2"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-2`
                                : undefined
                        }
                        title="1 star"
                    ></label>
                    <input
                        type="radio"
                        id={
                            !isUserReview
                                ? "publicRating-1"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-1`
                                : undefined
                        }
                        name={
                            !isUserReview
                                ? "publicRating"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}`
                                : "userRating"
                        }
                        value="0.5"
                    />
                    <label
                        className="half label"
                        htmlFor={
                            !isUserReview
                                ? "publicRating-1"
                                : typeof reviewUser === "object"
                                ? `userRating-${reviewUser.id}-1`
                                : undefined
                        }
                        title="1/2 star"
                    ></label>
                </fieldset>
            </div>
            {isUserReview && (
                <p className="p-2 text-sm rounded-sm bg-bg text-darker-text">
                    {typeof reviewUser === "object" &&
                    reviewText != undefined &&
                    reviewText?.length > 0
                        ? reviewText
                        : "No Comments Available"}
                </p>
            )}
        </div>
    );
};

export default ReviewCard;
