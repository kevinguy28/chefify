import React from "react";
import { Link } from "react-router-dom";
import { RecipeCardProp } from "@/interfaces/interfaces";

const RecipeCard: React.FC<RecipeCardProp> = ({ recipe }) => {
    return (
        <div key={recipe?.id} className="rounded-xl bg-dark w-90 mx-auto">
            <img
                className="rounded-t-xl w-full h-50"
                alt={recipe?.name ?? "Recipe Image"}
                src={
                    recipe?.image
                        ? `http://localhost:8000${recipe.image}`
                        : `http://localhost:8000/media/images/recipes/default-recipe.png`
                }
            />

            <h1 className="p-2 flex flex-col justify-between">
                <Link
                    to={`/recipe/${recipe?.id}`}
                    className="font-bold hover:text-duck-pale-yellow"
                >
                    {recipe?.name}{" "}
                </Link>
                <span className="text-darker-text text-sm">
                    {recipe?.cuisine?.name ? recipe.cuisine.name : "N/A"} |{" "}
                    {recipe?.user.username}
                </span>
                <hr />
            </h1>
            <p className="p-2 text-darker-text text-sm">
                {recipe?.description}
            </p>
        </div>
    );
};

export default RecipeCard;
