import React from "react";
import { Recipe } from "@/interfaces/interfaces";

const RecipeCard: React.FC<Recipe> = (props) => {
    return (
        <div key={props.id} className="rounded-xl bg-white w-80">
            <img
                className="rounded-t-xl w-full max-h-50"
                alt={props.name}
                src={`http://localhost:8000${props.image}`}
            />
            <h1 className="p-2">
                {props.name} | {props.cuisine.name}
            </h1>
            <p className="p-2">{props.description}</p>
        </div>
    );
};

export default RecipeCard;
