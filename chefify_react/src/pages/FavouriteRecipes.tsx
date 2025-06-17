import { useAuth } from "@/contexts/useAuth";
import { Recipe } from "@/interfaces/interfaces";
import { useState, useEffect } from "react";
import RecipeContainer from "@/components/RecipeContainer";
import FavouriteLogo from "@/assets/favourite-icon.svg?react";
import { readUserProfileFavouriteRecipes } from "@/endpoints/api";

const FavouriteRecipes = () => {
    const [favouriteRecipes, setFavouriteRecipes] = useState<Array<Recipe>>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrevious, setHasPrevious] = useState<boolean>(false);

    const fetchFavouriteRecipes = async (page: number) => {
        const response = await readUserProfileFavouriteRecipes(page);
        if (response) {
            console.log(response);
            setCurrentPage(response.page);
            setHasNext(response.hasNext);
            setHasPrevious(response.hasPrevious);
            setFavouriteRecipes(response.recipes);
        }
    };

    useEffect(() => {
        fetchFavouriteRecipes(currentPage);
    }, []);

    return (
        <div className="flex flex-col gap-4 p-4 mx-auto mt-8 max-w-screen-2xl min-w-160 ">
            <div className="flex items-center gap-4 mx-auto">
                <FavouriteLogo className="w-10 h-10" />
                <div className="text-3xl font-bold">Favourite Recipes </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 max-w-">
                {favouriteRecipes.map((recipe) => (
                    <RecipeContainer recipe={recipe} edit={false} />
                ))}
            </div>
            <div className="relative flex justify-center my-10 ">
                <span className="relative font-bold">
                    {hasPrevious && (
                        <span
                            className="absolute cursor-pointer right-20"
                            onClick={() =>
                                fetchFavouriteRecipes(currentPage - 1)
                            }
                        >
                            Previous
                        </span>
                    )}
                    {currentPage}
                    {hasNext && (
                        <span
                            className="absolute cursor-pointer left-20"
                            onClick={() =>
                                fetchFavouriteRecipes(currentPage + 1)
                            }
                        >
                            Next
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default FavouriteRecipes;
