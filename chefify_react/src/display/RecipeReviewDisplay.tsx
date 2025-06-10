import { readRecipeReviews, updateReviewLiked } from "@/endpoints/api";
import { Review, RecipeReviewDisplayProp } from "@/interfaces/interfaces";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import DislikeBtn from "@/assets/dislike-btn.svg?react";
import LikeBtn from "@/assets/like-btn.svg?react";

const RecipeReviewDisplay: React.FC<RecipeReviewDisplayProp> = ({ recipe }) => {
    const { user } = useAuth();
    const [recipeReviews, setRecipeReviews] = useState<Array<Review>>([]);
    const [checkedRelevant, setCheckedRelevant] = useState<boolean>(true);
    const [checkedNewest, setCheckedNewest] = useState<boolean>(false);
    const [checkedOldest, setCheckedOldest] = useState<boolean>(false);
    const [checkedHighest, setCheckedHighest] = useState<boolean>(false);
    const [checkedLowest, setCheckedLowest] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrevious, setHasPrevious] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number | null>(null);

    const fetchRecipeReviews = async (page: number) => {
        const response = await readRecipeReviews(
            recipe.id.toString(),
            "true",
            page,
            checkedRelevant.toString(),
            checkedNewest.toString(),
            checkedOldest.toString(),
            checkedHighest.toString(),
            checkedLowest.toString()
        );
        if (response) {
            setRecipeReviews(response.reviews);
            setCurrentPage(response.page);
            setHasNext(response.hasNext);
            setHasPrevious(response.hasPrevious);
            setTotalPages(response.totalPages);
        }
    };

    const imgStarReview = (rating: number) => {
        if (rating % 1 == 0) {
            return (
                <div className="flex flex-row">
                    {Array.from({ length: rating }).map((_, index) => (
                        <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            fill="currentColor"
                            className="w-4 h-4 text-duck-yellow"
                        >
                            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                        </svg>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="flex flex-row ">
                    {Array.from({ length: rating }).map((_, index) => (
                        <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            fill="currentColor"
                            className="w-4 h-4 text-duck-yellow"
                        >
                            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                        </svg>
                    ))}
                    <svg
                        key="half-rating"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        fill="currentColor"
                        className="w-4 h-4 text-duck-yellow"
                    >
                        <path d="M288 0c-12.2 .1-23.3 7-28.6 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3L288 439.8 288 0zM429.9 512c1.1 .1 2.1 .1 3.2 0l-3.2 0z" />
                    </svg>
                </div>
            );
        }
    };

    const handleToggle = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        const elementId = (e.target as HTMLSpanElement).id;
        console.log(elementId);
        const toggleState: {
            [key: string]: {
                state: boolean;
                setState: React.Dispatch<React.SetStateAction<boolean>>;
                otherState1: React.Dispatch<React.SetStateAction<boolean>>;
                otherState2: React.Dispatch<React.SetStateAction<boolean>>;
                otherState3: React.Dispatch<React.SetStateAction<boolean>>;
                otherState4: React.Dispatch<React.SetStateAction<boolean>>;
            };
        } = {
            "fltrBtn-review-old": {
                state: checkedOldest,
                setState: setCheckedOldest,
                otherState1: setCheckedNewest,
                otherState2: setCheckedHighest,
                otherState3: setCheckedLowest,
                otherState4: setCheckedRelevant,
            },
            "fltrBtn-review-new": {
                state: checkedNewest,
                setState: setCheckedNewest,
                otherState1: setCheckedOldest,
                otherState2: setCheckedHighest,
                otherState3: setCheckedLowest,
                otherState4: setCheckedRelevant,
            },
            "fltrBtn-review-high": {
                state: checkedHighest,
                setState: setCheckedHighest,
                otherState1: setCheckedLowest,
                otherState2: setCheckedNewest,
                otherState3: setCheckedOldest,
                otherState4: setCheckedRelevant,
            },
            "fltrBtn-review-low": {
                state: checkedLowest,
                setState: setCheckedLowest,
                otherState1: setCheckedHighest,
                otherState2: setCheckedNewest,
                otherState3: setCheckedOldest,
                otherState4: setCheckedRelevant,
            },
            "fltrBtn-review-rel": {
                state: checkedRelevant,
                setState: setCheckedRelevant,
                otherState1: setCheckedHighest,
                otherState2: setCheckedLowest,
                otherState3: setCheckedNewest,
                otherState4: setCheckedOldest,
            },
        };

        if (toggleState[elementId]) {
            const {
                state,
                setState,
                otherState1,
                otherState2,
                otherState3,
                otherState4,
            } = toggleState[elementId];
            setState(!state);
            otherState1(false);
            otherState2(false);
            otherState3(false);
            otherState4(false);
        }
    };

    const handleLike = async (reviewId: string, isLike: boolean) => {
        const response = await updateReviewLiked(reviewId, isLike);
        if (response) {
            setRecipeReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.id.toString() === reviewId ? response : review
                )
            );
        }
    };

    useEffect(() => {
        fetchRecipeReviews(currentPage);
    }, [recipe]);

    useEffect(() => {
        fetchRecipeReviews(currentPage);
    }, [checkedNewest, checkedOldest, checkedHighest, checkedLowest]);

    return (
        <div className="mx-auto sm:w-120 md:w-150 ">
            <h1 className="font-bold ">Public Reviews</h1>
            <div className="flex flex-row flex-wrap gap-2 my-4 text-md">
                <span
                    id="fltrBtn-review-rel"
                    className={` text-sm p-2 bg-dark rounded-md flex items-center ${
                        checkedRelevant
                            ? "border-2 border-blue-500 border-solid"
                            : ""
                    }`}
                    onClick={(e) => handleToggle(e)}
                >
                    Relevant
                </span>
                <span
                    id="fltrBtn-review-new"
                    className={`text-sm p-2 bg-dark rounded-md flex items-center ${
                        checkedNewest
                            ? "border-2 border-blue-500 border-solid"
                            : ""
                    }`}
                    onClick={(e) => handleToggle(e)}
                >
                    Newest
                </span>
                <span
                    id="fltrBtn-review-old"
                    className={`text-sm p-2 bg-dark rounded-md flex items-center ${
                        checkedOldest
                            ? "border-2 border-blue-500 border-solid"
                            : ""
                    }`}
                    onClick={(e) => handleToggle(e)}
                >
                    Oldest
                </span>
                <span
                    id="fltrBtn-review-high"
                    className={`text-sm p-2 bg-dark rounded-md flex items-center ${
                        checkedHighest
                            ? "border-2 border-blue-500 border-solid"
                            : ""
                    }`}
                    onClick={(e) => handleToggle(e)}
                >
                    Highest
                </span>
                <span
                    id="fltrBtn-review-low"
                    className={`text-sm p-2 bg-dark rounded-md flex items-center ${
                        checkedLowest
                            ? "border-2 border-blue-500 border-solid"
                            : ""
                    }`}
                    onClick={(e) => handleToggle(e)}
                >
                    Lowest
                </span>
            </div>
            <div className="flex flex-wrap gap-4 ">
                {recipeReviews.map((review) => (
                    <div className="p-4 bg-dark sm:w-120 lg:w-73">
                        <div className="flex flex-row items-center justify-between min-w-0">
                            <div className="flex items-center min-w-0 gap-2">
                                <img
                                    className="w-10 h-10 bg-blue-500 rounded-md"
                                    alt={
                                        review?.user.username ?? "Recipe Image"
                                    }
                                    src={
                                        review.userProfile?.profilePicture
                                            ? `http://localhost:8000${review?.userProfile.profilePicture}`
                                            : `http://localhost:8000/media/images/recipes/default-recipe.png`
                                    }
                                />
                                <h1 className="truncate min-w-0 overflow-hidden max-w-[10rem] ">
                                    {review.user.username}
                                </h1>
                            </div>

                            {imgStarReview(review.rating)}
                        </div>

                        {review.review_text && (
                            <div className="my-4 text-sm">
                                {review.review_text}
                            </div>
                        )}
                        <div className="flex flex-row items-center gap-4">
                            <LikeBtn
                                className={`w-4 h-4 ${
                                    user &&
                                    review.likedBy
                                        .flatMap((review) => review.id)
                                        .includes(user.id)
                                        ? "text-blue-500"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleLike(review.id.toString(), true)
                                }
                            />

                            <span>{review.likes}</span>
                            <DislikeBtn
                                className={`w-4 h-4 ${
                                    user &&
                                    review.dislikedBy
                                        .flatMap((review) => review.id)
                                        .includes(user.id)
                                        ? "text-red-500"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleLike(review.id.toString(), false)
                                }
                            />
                            <span>{review.dislikes}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex justify-center my-10 ">
                <span className="relative font-bold">
                    {hasPrevious && (
                        <span
                            className="absolute cursor-pointer right-20"
                            onClick={() => fetchRecipeReviews(currentPage - 1)}
                        >
                            Previous
                        </span>
                    )}
                    {currentPage}
                    {hasNext && (
                        <span
                            className="absolute cursor-pointer left-20"
                            onClick={() => fetchRecipeReviews(currentPage + 1)}
                        >
                            Next
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default RecipeReviewDisplay;
