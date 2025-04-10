import { readRecipeReviews, updateReviewLiked } from "@/endpoints/api";
import { Review, RecipeReviewDisplayProp } from "@/interfaces/interfaces";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import { setHeapSnapshotNearHeapLimit } from "v8";

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
        <div>
            <div className="my-4 flex flex-row flex-wrap gap-2 ">
                <span
                    id="fltrBtn-review-rel"
                    className={`p-2 bg-dark ${
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
                    className={`p-2 bg-dark  ${
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
                    className={`p-2 bg-dark  ${
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
                    className={`p-2 bg-dark  ${
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
                    className={`p-2 bg-dark  ${
                        checkedLowest
                            ? "border-2 border-blue-500 border-solid"
                            : ""
                    }`}
                    onClick={(e) => handleToggle(e)}
                >
                    Lowest
                </span>
            </div>

            {recipeReviews.map((review) => (
                <div className="bg-dark p-4 my-2">
                    {" "}
                    <div className="flex flex-row  min-w-0 justify-between items-center">
                        <h1 className="break-words overflow-hidden">
                            {review.user.username}{" "}
                        </h1>
                        {imgStarReview(review.rating)}
                    </div>
                    {review.review_text && (
                        <div className="my-4">{review.review_text}</div>
                    )}
                    <div className="flex gap-4 flex-row items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
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
                        >
                            <path d="M12.3657 0.888071C12.6127 0.352732 13.1484 0 13.75 0C14.9922 0 15.9723 0.358596 16.4904 1.29245C16.7159 1.69889 16.8037 2.13526 16.8438 2.51718C16.8826 2.88736 16.8826 3.28115 16.8826 3.62846L16.8825 7H20.0164C21.854 7 23.2408 8.64775 22.9651 10.4549L21.5921 19.4549C21.3697 20.9128 20.1225 22 18.6434 22H8L8 9H8.37734L12.3657 0.888071Z" />
                            <path d="M6 9H3.98322C2.32771 9 1 10.3511 1 12V19C1 20.6489 2.32771 22 3.98322 22H6L6 9Z" />
                        </svg>
                        <span>{review.likes}</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
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
                        >
                            <path d="M12.3657 23.1119C12.6127 23.6473 13.1484 24 13.75 24C14.9922 24 15.9723 23.6414 16.4904 22.7076C16.7159 22.3011 16.8037 21.8647 16.8438 21.4828C16.8826 21.1126 16.8826 20.7188 16.8826 20.3715L16.8825 17H20.0164C21.854 17 23.2408 15.3523 22.9651 13.5451L21.5921 4.54507C21.3697 3.08717 20.1225 2 18.6434 2H8L8 15H8.37734L12.3657 23.1119Z" />
                            <path d="M6 15H3.98322C2.32771 15 1 13.6489 1 12V5C1 3.35111 2.32771 2 3.98322 2H6L6 15Z" />
                        </svg>
                        <span>{review.dislikes}</span>
                    </div>
                    <div className="relative flex justify-center my-10 ">
                        <span className="font-bold relative">
                            {hasPrevious && (
                                <span
                                    className="absolute right-20 cursor-pointer"
                                    onClick={() =>
                                        fetchRecipeReviews(currentPage - 1)
                                    }
                                >
                                    Previous
                                </span>
                            )}
                            {currentPage}
                            {hasNext && (
                                <span
                                    className="absolute left-20 cursor-pointer"
                                    onClick={() =>
                                        fetchRecipeReviews(currentPage + 1)
                                    }
                                >
                                    Next
                                </span>
                            )}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecipeReviewDisplay;
