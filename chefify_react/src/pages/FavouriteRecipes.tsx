import RecipeCard from "@/components/RecipeCard";
import { useAuth } from "@/contexts/useAuth";
import { Recipe } from "@/interfaces/interfaces";
import React, { useState, useEffect } from "react";

const FavouriteRecipes = () => {
    const { userProfile } = useAuth();

    const [favouriteRecipes, setFavouriteRecipes] = useState<Array<Recipe>>([]);

    useEffect(() => {
        if (userProfile) {
            setFavouriteRecipes(userProfile.favouriteRecipes);
            console.log(userProfile.favouriteRecipes);
        }
    }, []);

    return (
        <div className="w-90">
            {favouriteRecipes.map((recipe) => (
                <RecipeCard
                    recipe={recipe}
                    traverseMode={false}
                    editMode={false}
                />
            ))}
        </div>
    );
};

export default FavouriteRecipes;
