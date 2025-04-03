import React, { useEffect, useState } from "react";
import { readCuisines, readRecipe } from "@/endpoints/api";
import { useParams } from "react-router-dom";
import { Cuisine, Recipe, RecipeEditFormProps } from "@/interfaces/interfaces";
import { updateRecipe } from "@/endpoints/api";

import photo_png from "@/assets/add_photo_alternate_outlined.png";

const RecipeEditForm: React.FC<RecipeEditFormProps> = ({
    recipe,
    setLoaded,
}) => {
    const { recipeId } = useParams();
    const [allCuisines, setAllCuisines] = useState<Array<Cuisine>>([]);
    const [receivedRecipe, setReceivedRecipe] = useState<Boolean>(false);

    const [recipeName, setRecipeName] = useState<string>("");
    const [recipeCuisine, setRecipeCuisine] = useState<string>("");
    const [recipePrivacy, setRecipePrivacy] = useState<string>("");
    const [recipeDescription, setRecipeDescription] = useState<string>("");
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
    const [recipeImageUrl, setRecipeImageUrl] = useState<string>("");
    const [recipeImage, setRecipeImage] = useState<File | null>(null);

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
        if (submitData) {
            setLoaded(false);
            setReceivedRecipe(false);
        }
        return;
    };

    useEffect(() => {
        if (recipe) {
            fetchCuisines();
            setRecipeName(recipe.name);
            setRecipeCuisine(recipe.cuisine.name);
            setRecipePrivacy(recipe.privacy);
            setRecipeDescription(recipe.description);
            if (recipe.image) {
                setOriginalImageUrl(recipe.image);
            }
            setRecipeImageUrl("");
            setReceivedRecipe(true);
        }
    }, [recipe]);

    return (
        <form className="flex flex-col justify-center p-4 gap-4">
            <h1 className="sm:w-4/5 lg:w-full mx-auto font-bold text-xl">
                Edit Recipe: {recipe?.name}
            </h1>
            <div className="sm:w-4/5 lg:w-full mx-auto">
                <label className=" text-xl">Name</label>
                <hr />
                <br />
                <input
                    className="w-full p-4 bg-duck-yellow rounded-xl mx-auto text-alt-text"
                    placeholder={recipe?.name}
                    value={recipeName}
                    name="selectRecipeName"
                    type="text"
                    onChange={(e) => setRecipeName(e.target.value)}
                />
                <br />
            </div>
            <div className="sm:w-4/5 lg:w-full mx-auto">
                <label className=" text-xl">Cuisine</label>
                <hr />
                <br />
                <select
                    className="w-full p-4  bg-duck-yellow text-alt-text rounded-xl"
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
            <div className="sm:w-4/5 lg:w-full mx-auto">
                <label className=" text-xl">Privacy</label>
                <hr />
                <br />
                <select
                    className="w-full p-4 bg-duck-yellow text-alt-text rounded-xl"
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
            <div className="sm:w-4/5 lg:w-full mx-auto">
                <label className=" text-xl">Description</label>
                <hr />
                <br />
                <textarea
                    className="w-full p-4 sm:h-40 lg:h-100 bg-duck-yellow text-alt-text rounded-xl resize-none"
                    value={recipeDescription}
                    placeholder={recipe?.description}
                    onChange={(e) => setRecipeDescription(e.target.value)}
                    maxLength={200}
                ></textarea>
                <br />
            </div>
            {originalImageUrl && (
                <div className="sm:w-4/5 lg:w-full mx-auto">
                    <label className=" text-xl">Original Image</label>
                    <hr />
                    <br />
                    <img
                        src={`http://localhost:8000${originalImageUrl}`}
                        alt="Uploaded Recipe"
                        className="sm:w-90 h-50 rounded-lg mx-auto" // Add your desired styles
                    />
                </div>
            )}
            <div className="sm:w-4/5 lg:w-full mx-auto">
                <label className="text-xl">Image</label>
                <hr />
                <br />
                <label
                    className={`flex p-2 w-full items-center justify-center cursor-pointer border-solid border-2 text-center rounded-xl ${
                        recipeImage
                            ? "bg-duck-yellow"
                            : "bg-duck-less-pale-yellow"
                    }`}
                >
                    <img src={photo_png}></img>
                    <p className="flex-grow text-alt-text">Upload Image</p>
                    <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </label>

                {recipeImage && (
                    <>
                        <br />
                        <div className="w-full">
                            <img
                                src={`${recipeImageUrl}`}
                                alt="Uploaded Recipe"
                                className="sm:w-90 h-50 rounded-lg mx-auto"
                            />
                        </div>
                    </>
                )}
                <br />
                <hr />
            </div>
            <input
                className="sm:w-4/5 lg:w-full py-4 bg-duck-pale-yellow hover:bg-white  text-alt-text rounded-lg mx-auto"
                type="submit"
                value="Submit Changes"
                onClick={handleSubmit}
            />
        </form>
    );
};

export default RecipeEditForm;
