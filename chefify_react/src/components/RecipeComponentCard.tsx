import React, { useEffect, useState } from "react";
import { RecipeComponentCardProp } from "@/interfaces/interfaces";
import { getRecipeIngredients, deleteRecipeComponent } from "@/endpoints/api";

const RecipeComponentCard: React.FC<RecipeComponentCardProp> = ({
    component,
}) => {
    const [recipeIngredients, setRecipeIngredients] = useState<Array<any>>([]);

    const fetchRecipeIngredients = async () => {
        const response = await getRecipeIngredients(
            component.recipe.id,
            component.id
        );
        if (response) {
            setRecipeIngredients(response);
        }
    };

    const handleDeleteCard = async () => {
        const response = await deleteRecipeComponent(component.id.toString());
        if (response) {
            console.log("as");
        }
    };

    useEffect(() => {
        fetchRecipeIngredients();
    }, []);
    return (
        <div className="bg-dark-light p-2 rounded-xl mb-4">
            <h1 className="font-bold text-xl flex gap-4">{component.name}</h1>
            <p>{component.description}</p>
            <hr />
            {recipeIngredients &&
                recipeIngredients.map((ingredient) => (
                    <>
                        <div>
                            {ingredient.quantity} {ingredient.unit} -{" "}
                            {ingredient.ingredient.name}
                        </div>
                    </>
                ))}
            <div className="flex gap-4 justify-end">
                <div>Edit</div>
                <div onClick={handleDeleteCard}>Delete</div>
            </div>
        </div>
    );
};

export default RecipeComponentCard;
