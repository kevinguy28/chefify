import React, { useState, useEffect } from "react";
import { get_cuisines, createRecipe } from "@/endpoints/api";
import { useNavigate } from "react-router-dom";

const RecipeForm = () => {
    const [recipeName, setRecipeName] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [recipeCuisine, setRecipeCuisine] = useState<Array<any>>([]);
    const nav = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (recipeName.trim()) {
            const createdRecipe = await createRecipe(recipeName, cuisine);
            if (createdRecipe && createdRecipe?.id) {
                console.log("Navigating to:", `/recipe/${createdRecipe.id}/`);
                nav(`/recipe/${createdRecipe.id}`);
            }
        } else {
            alert("Name of the recipe cannot be empty!");
        }
    };

    useEffect(() => {
        const fetchCuisines = async () => {
            const cuisines = await get_cuisines();
            if (Array.isArray(cuisines)) {
                setRecipeCuisine(cuisines);
            }
        };
        fetchCuisines();
    }, []);

    return (
        <form className="flex flex-col justify-center items-center bg-amber-600 p-4">
            <h1 className="font-bold text-2xl text-center">Create a Recipe!</h1>
            <br />
            <input
                className="w-70 p-4 bg-duck-yellow rounded-xl"
                placeholder="Name of Recipe"
                value={recipeName}
                name="selectRecipeName"
                type="text"
                onChange={(e) => setRecipeName(e.target.value)}
            />
            <br />
            <select
                className="w-70  p-4 bg-duck-yellow rounded-xl"
                name="selectCuisine"
                onChange={(e) => setCuisine(e.target.value)}
                value={cuisine}
            >
                <option key="N/A">N/A</option>
                {recipeCuisine.map((cuisine) => (
                    <option key={cuisine.id}>
                        {cuisine.name} <br />
                    </option>
                ))}
            </select>
            <br />
            <input
                className="w-70 py-4  bg-duck-pale-yellow rounded-lg hover:bg-duck-yellow font-bol"
                type="submit"
                value="Create Recipe"
                onClick={handleSubmit}
            />
        </form>
    );
};

export default RecipeForm;
