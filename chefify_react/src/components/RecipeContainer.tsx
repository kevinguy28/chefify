import React, { useEffect, useState } from "react";
import { RecipeContainerProp } from "@/interfaces/interfaces";
import { updateFavouriteRecipeUserProfile } from "@/endpoints/api";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import FavouriteLogo from "@/assets/favourite-icon.svg?react";

const RecipeContainer: React.FC<RecipeContainerProp> = ({ recipe, edit }) => {
    const formattedDate = recipe.created
        ? new Date(recipe.created).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
          })
        : "Unknown";

    const { userProfile } = useAuth();

    const [favourited, setFavourited] = useState<boolean>(false);

    const handleFavourite = async (e: React.MouseEvent) => {
        e.preventDefault(); // Optional: Prevents navigation if clicked as <a>

        if (recipe) {
            const response = await updateFavouriteRecipeUserProfile(
                recipe?.id.toString(),
                favourited.toString()
            );
            if (response) {
                setFavourited((prev) => !prev);
            }
        }
    };

    useEffect(() => {
        if (recipe) {
            setFavourited(false);
            const isIn = userProfile?.favouriteRecipes.find(
                (favRec) => favRec.id === recipe.id
            );
            if (isIn) {
                setFavourited(true);
            }
        }
    }, [recipe]);

    return (
        <div className="max-w-100 w-100 h-35 p-2 flex items-center bg-dark-light transition-transform duration-300 ease-in-out transform hover:scale-105 ">
            <img
                className=" w-30 h-30 object-cover"
                alt={recipe?.name ?? "Recipe Image"}
                src={
                    recipe?.image
                        ? `http://localhost:8000${recipe.image}`
                        : `http://localhost:8000/media/images/recipes/default-recipe.png`
                }
            />
            <div className="h-30 px-2 flex flex-col overflow-hidden grow">
                <div className="flex justify-between items-center ">
                    <h3 className="text-darker-text ">{formattedDate}</h3>
                    {!edit && (
                        <span title="Add to favourites">
                            <FavouriteLogo
                                className={`hover:text-duck-pale-yellow w-5 h-5 ${`${
                                    favourited
                                        ? "text-orange-herbsSpices-light"
                                        : "text-duck-yellow"
                                }`}`}
                                onClick={handleFavourite}
                            />
                        </span>
                    )}
                </div>
                {edit ? (
                    <div className="text-xl font-bold ">{recipe.name}</div>
                ) : (
                    <Link
                        to={`/recipe/${recipe?.id}`}
                        className="text-xl font-bold hover:text-pepper-dark-green"
                    >
                        {recipe.name}
                    </Link>
                )}

                <p className="line-clamp-3 text-sm text-duck-dark-white overflow-hidden">
                    {recipe.description}
                </p>
            </div>
        </div>
    );
};

export default RecipeContainer;
