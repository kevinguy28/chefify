import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeCardProp } from "@/interfaces/interfaces";
import { updateFavouriteRecipeUserProfile } from "@/endpoints/api";
import { useAuth } from "@/contexts/useAuth";
import FavouriteIcon from "@/assets/favourite-icon.svg?react";

const RecipeCard: React.FC<RecipeCardProp> = ({
    recipe,
    traverseMode,
    editMode,
}) => {
    const { userProfile } = useAuth();

    const [favourited, setFavourited] = useState<boolean>(false);

    const handleFavourite = async () => {
        if (recipe) {
            const response = await updateFavouriteRecipeUserProfile(
                recipe?.id.toString(),
                favourited.toString()
            );
            if (response) {
                setFavourited((favourited) => !favourited);
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
        <div key={recipe?.id} className="bg-dark w-80 mx-auto">
            <img
                className=" w-full h-50"
                alt={recipe?.name ?? "Recipe Image"}
                src={
                    recipe?.image
                        ? `http://localhost:8000${recipe.image}`
                        : `http://localhost:8000/media/images/recipes/default-recipe.png`
                }
            />
            <div className="w-full p-2">
                <div className="p-2 flex flex-row justify-between items-center  border-box">
                    <h1 className="flex flex-col justify-between min-w-0 w-full">
                        {traverseMode ? (
                            <Link
                                to={`/recipe/${recipe?.id}`}
                                className="font-bold hover:text-duck-pale-yellow"
                            >
                                {recipe?.name}
                            </Link>
                        ) : (
                            <div className="font-bold break-words">
                                {recipe?.name}
                            </div>
                        )}

                        <span className="text-darker-text text-sm truncate min-w-0 max-w-full">
                            {recipe?.cuisine?.name
                                ? recipe.cuisine.name
                                : "N/A"}{" "}
                            | {recipe?.user.username}
                        </span>
                    </h1>

                    <FavouriteIcon
                        className={`m-2 w-8 h-8 ${`${
                            favourited
                                ? "text-orange-herbsSpices-light"
                                : "text-duck-yellow"
                        }`}`}
                        onClick={handleFavourite}
                    />
                </div>
                <hr className="mx-2" />
            </div>

            <p className="px-4 py-4  text-darker-text text-sm">
                {recipe?.description}
            </p>
            {editMode && (
                <Link to={`/recipe/update/${recipe?.id}`} className="p-2">
                    Edit
                </Link>
            )}
        </div>
    );
};

export default RecipeCard;
