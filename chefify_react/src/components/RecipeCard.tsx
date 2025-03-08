import React from "react";
import { RecipeCardProp } from "@/interfaces/interfaces";

const RecipeCard: React.FC<RecipeCardProp> = ({ recipe }) => {
    return (
        <div
            key={recipe?.id}
            className="h-120 rounded-xl bg-white w-80 mx-auto"
        >
            <img
                className="rounded-t-xl w-full h-50"
                alt={recipe?.name}
                src={`http://localhost:8000${recipe?.image}`}
            />
            <h1 className="p-2">
                {recipe?.name} | {recipe?.cuisine.name}
            </h1>
            <p className="p-2">{recipe?.description}</p>
        </div>
    );
};

export default RecipeCard;
