import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/useAuth";
import { useParams } from "react-router-dom";
import { PrivateRouteProps } from "@/interfaces/interfaces";
import { readRecipe } from "@/endpoints/api";
import { Recipe } from "@/interfaces/interfaces";

const PrivateRoutesUserRecipe = ({ children }: PrivateRouteProps) => {
    const { user } = useAuth();
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [verifiedUser, setVerifiedUser] = useState<Boolean>(false);

    const fetchRecipe = async () => {
        const response = await readRecipe(String(recipeId));
        if (response) {
            setRecipe(response);
        }
    };

    useEffect(() => {
        if (recipeId) {
            fetchRecipe(); // Fetch the recipe when the recipeId changes
        }
    }, [recipeId]);

    useEffect(() => {
        if (recipe) {
            // Check if the logged-in user is the owner of the recipe
            if (recipe.user.id === user?.id) {
                setVerifiedUser(true); // The user is the owner
            } else {
                setVerifiedUser(false); // The user is not the owner
            }
        }
    }, [recipe, user]);

    // Show loading state or redirect if not verified
    if (verifiedUser === null) {
        return <div>Loading...</div>; // Show loading while verifying
    }

    if (verifiedUser === false) {
        return <div>You do not have permission to edit this recipe.</div>; // Show if the user is not the owner
    }

    return <>{children}</>; // Return the children if the user is verified as the recipe owner
};

export default PrivateRoutesUserRecipe;
