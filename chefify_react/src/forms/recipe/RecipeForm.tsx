import React, { useState, useEffect } from "react";
import { readCuisines, createRecipe } from "@/endpoints/api";
import { useNavigate } from "react-router-dom";
import CuisineLogo from "@/assets/cuisine.svg?react";

const RecipeForm = () => {
    const [recipeName, setRecipeName] = useState("");
    const [cuisine, setCuisine] = useState("N/A");
    const [recipeCuisine, setRecipeCuisine] = useState<Array<any>>([]);
    const nav = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (recipeName.trim()) {
            const createdRecipe = await createRecipe(recipeName, cuisine);
            if (createdRecipe && createdRecipe?.id) {
                nav(`/recipe/update/${createdRecipe.id}`);
            }
        } else {
            alert("Name of the recipe cannot be empty!");
        }
    };

    useEffect(() => {
        const fetchCuisines = async () => {
            const cuisines = await readCuisines();
            if (Array.isArray(cuisines)) {
                setRecipeCuisine(cuisines);
            }
        };
        fetchCuisines();
    }, []);

    return (
        <form className="flex flex-col gap-4 ">
            <h1 className="text-xl font-bold">Create a Recipe</h1>
            <div className="flex flex-col gap-4">
                <label htmlFor="selectRecipeName" className="font-bold">
                    Name:
                </label>
                <input
                    className="p-2 rounded-lg w-80 h-14 bg-dark"
                    placeholder="Name of Recipe"
                    value={recipeName}
                    name="selectRecipeName"
                    type="text"
                    onChange={(e) => setRecipeName(e.target.value)}
                />
                <label htmlFor="selectCuisine" className="font-bold">
                    Cuisine:
                </label>
                <div className="flex items-center gap-2 p-2 rounded-lg w-80 bg-dark">
                    <CuisineLogo fill="currentColor" className="w-10 h-10" />
                    <select
                        className="p-2 rounded-lg grow outline-0 bg-dark"
                        name="selectCuisine"
                        onChange={(e) => setCuisine(e.target.value)}
                        value={cuisine}
                    >
                        <option key="N/A">N/A</option>
                        {recipeCuisine.map((theCuisine) => (
                            <option key={theCuisine.id}>
                                {theCuisine.name}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    className="py-2 bg-green-600 rounded-lg w-80 h-14 hover:bg-green-700 "
                    type="submit"
                    value="Create Recipe"
                    onClick={handleSubmit}
                />
            </div>
        </form>
    );
};

export default RecipeForm;
