import React, { useEffect, useState } from "react";
import { readCuisines, readRecipe } from "@/endpoints/api";
import { useParams } from "react-router-dom";
import { Cuisine, Recipe } from "@/interfaces/interfaces";
import { updateRecipe } from "@/endpoints/api";

const RecipeEditForm = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<Recipe | undefined>();
    const [allCuisines, setAllCuisines] = useState<Array<Cuisine>>([]);
    const [loaded, setLoad] = useState<boolean>(false);

    const [recipeName, setRecipeName] = useState<string>("");
    const [recipeCuisine, setRecipeCuisine] = useState<string>("");
    const [recipePrivacy, setRecipePrivacy] = useState<string>("");
    const [recipeDescription, setRecipeDescription] = useState<string>("");
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
    const [recipeImageUrl, setRecipeImageUrl] = useState<string>("");
    const [recipeImage, setRecipeImage] = useState<File | null>(null);

    const fetchRecipe = async () => {
        const retrievedRecipe = await readRecipe(String(recipeId));

        if (retrievedRecipe) {
            const { name } = retrievedRecipe.cuisine;
            setRecipe(retrievedRecipe);
            setRecipeName(retrievedRecipe.name);
            setRecipeCuisine(name);
            setRecipePrivacy(retrievedRecipe.privacy);
            setRecipeDescription(retrievedRecipe.description);
            setOriginalImageUrl(retrievedRecipe.image);
            setLoad(true);
        } else {
            console.error("No valid recipe found!");
        }
    };

    const fetchCuisines = async () => {
        const retrievedCuisines = await readCuisines();
        if (Array.isArray(retrievedCuisines)) {
            setAllCuisines(retrievedCuisines);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setRecipeImage(file);
            setRecipeImageUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = await updateRecipe(
            Number(recipeId),
            recipeName,
            recipeCuisine,
            recipePrivacy,
            recipeDescription,
            recipeImage
        );
        return;
    };

    useEffect(() => {
        if (!loaded) {
            fetchCuisines();
            fetchRecipe();
        }
    }, [loaded]);

    return (
        <form className="flex flex-col justify-center p-4 gap-4 bg-red-400">
            <h1 className="w-100 mx-auto font-bold text-xl">
                Editing Recipe:
                <span className="italic"> {recipe?.name}</span>
            </h1>
            <div className="w-100 mx-auto">
                <label className="font-bold text-xl">Name</label>
                <input
                    className="w-full p-4 mx-auto bg-duck-yellow rounded-xl"
                    placeholder={recipe?.name}
                    value={recipeName}
                    name="selectRecipeName"
                    type="text"
                    onChange={(e) => setRecipeName(e.target.value)}
                />
                <br />
            </div>
            <div className="w-100 mx-auto">
                <label className="font-bold text-xl">Cuisine</label>
                <select
                    className="w-full p-4 mx-auto bg-duck-yellow rounded-xl"
                    name="selectCuisine"
                    onChange={(e) => setRecipeCuisine(e.target.value)}
                    value={recipeCuisine}
                >
                    <option key="N/A">N/A</option>
                    {allCuisines.map((cuisine) => (
                        <option key={cuisine.id}>{cuisine.name}</option>
                    ))}
                </select>
                <br />
            </div>
            <div className="w-100 mx-auto">
                <label className="font-bold text-xl">Privacy</label>
                <select
                    className="w-100 p-4 mx-auto bg-duck-yellow rounded-xl"
                    name="selectPrivacy"
                    onChange={(e) => setRecipePrivacy(e.target.value)}
                    value={recipePrivacy}
                >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                </select>
                <br />
            </div>
            <div className="w-100 mx-auto">
                <label className="font-bold text-xl">Description</label>
                <textarea
                    className="w-100 p-4 mx-auto bg-duck-yellow rounded-xl resize-none"
                    rows={15}
                    value={recipeDescription}
                    placeholder={recipeDescription}
                    onChange={(e) => setRecipeDescription(e.target.value)}
                ></textarea>
                <br />
            </div>
            <label className="w-3/5 mx-auto px-12 cursor-pointer border-solid border-3 rounded-xl text-center">
                Upload Image
                <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </label>

            <div className="w-100 mx-auto">
                <label className="font-bold text-xl"> Uploaded Image</label>
                {recipeImageUrl ? (
                    <img
                        src={`${recipeImageUrl}`}
                        alt="Uploaded Recipe"
                        className="w-100 max-h-50 rounded-lg" // Add your desired styles
                    />
                ) : (
                    <div className="w-100 h-50 border-solid border-2 rounded-lg flex justify-center items-center">
                        N/A
                    </div>
                )}
            </div>

            <div className="w-100 mx-auto">
                <label className="font-bold text-xl">Original Image</label>
                {originalImageUrl ? (
                    <img
                        src={`http://localhost:8000${originalImageUrl}`}
                        alt="Uploaded Recipe"
                        className="w-100 max-h-50 rounded-lg" // Add your desired styles
                    />
                ) : (
                    <div className="w-100 h-50 border-solid border-2 rounded-lg flex justify-center items-center">
                        N/A
                    </div>
                )}
            </div>

            <input
                className="w-100 mx-auto py-4  bg-duck-pale-yellow rounded-lg hover:bg-duck-yellow font-bol"
                type="submit"
                value="Edit Recipe"
                onClick={handleSubmit}
            />
        </form>
    );
};

export default RecipeEditForm;
