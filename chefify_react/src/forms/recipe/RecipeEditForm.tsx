import React, { useEffect, useState } from "react";
import { readCuisines } from "@/endpoints/api";
import { useParams } from "react-router-dom";
import { Cuisine, RecipeEditFormProps } from "@/interfaces/interfaces";
import { updateRecipe } from "@/endpoints/api";
import CuisineLogo from "@/assets/cuisine.svg?react";
import PrivacyLogo from "@/assets/lock.svg?react";
import UploadLogo from "@/assets/upload.svg?react";
import { uploadUserImage } from "@/utils/util";
import { getAuth } from "firebase/auth";

const RecipeEditForm: React.FC<RecipeEditFormProps> = ({
    recipe,
    setLoaded,
}) => {
    const user = getAuth().currentUser;
    const { recipeId } = useParams();
    const [allCuisines, setAllCuisines] = useState<Array<Cuisine>>([]);

    const [recipeName, setRecipeName] = useState<string>("");
    const [recipeCuisine, setRecipeCuisine] = useState<string>("");
    const [recipePrivacy, setRecipePrivacy] = useState<string>("");
    const [recipeDescription, setRecipeDescription] = useState<string>("");
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
    const [recipeImageUrl, setRecipeImageUrl] = useState<string>("");
    const [recipeImage, setRecipeImage] = useState<File | null>(null);
    const [recipeImagePreviewUrl, setRecipeImagePreviewUrl] =
        useState<string>("");

    const fetchCuisines = async () => {
        const retrievedCuisines = await readCuisines();
        if (Array.isArray(retrievedCuisines)) {
            setAllCuisines(retrievedCuisines);
        }
    };

    // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const url = URL.createObjectURL(file);
    //         setRecipeImage(file);
    //         setRecipeImageUrl(url);
    //     }
    // };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setRecipeImage(file);
            setRecipeImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    // const submitData = await updateRecipe(
    //     Number(recipeId),
    //     recipeName,
    //     recipeCuisine,
    //     recipePrivacy,
    //     recipeDescription,
    //     recipeImage
    // );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return alert("You must be signed in to upload.");

        let uploadedUrl = recipeImageUrl;

        try {
            if (recipeImage !== null && recipe && recipe.id) {
                uploadedUrl = await uploadUserImage(
                    recipeImage,
                    user.uid,
                    recipe.id.toString()
                );
                setRecipeImageUrl(uploadedUrl);
            }
        } catch (error) {
            console.error("Upload failed: ", error);
            alert("Upload failed. Check console for details.");
        }

        const submitData = await updateRecipe(
            Number(recipeId),
            recipeName,
            recipeCuisine,
            recipePrivacy,
            recipeDescription,
            uploadedUrl
        );

        if (submitData) {
            setLoaded(false);
        }
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
            const defaultFirebaseImage =
                "https://firebasestorage.googleapis.com/v0/b/chefify-7cac2.firebasestorage.app/o/default%2Fchefify.png?alt=media&token=1644a56c-f8f6-459a-a6dc-69c260b78cf9";
            const finalImageUrl = recipe.recipeImageUrl || defaultFirebaseImage;
            ``;
            console.log(finalImageUrl);
            setRecipeImageUrl(finalImageUrl);
        }
    }, [recipe]);

    useEffect(() => {
        return () => {
            if (recipeImagePreviewUrl)
                URL.revokeObjectURL(recipeImagePreviewUrl);
        };
    }, [recipeImagePreviewUrl]);

    return (
        <form className="flex flex-col justify-center gap-4 p-4 mx-auto sm:w-120">
            <label className="font-bold">Name: </label>
            <input
                className="w-full p-4 mx-auto rounded-lg bg-dark "
                placeholder={recipe?.name}
                value={recipeName}
                name="selectRecipeName"
                type="text"
                onChange={(e) => setRecipeName(e.target.value)}
            />
            <label className="font-bold">Cuisine:</label>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-dark">
                <CuisineLogo fill="currentColor" className="w-10 h-10" />
                <select
                    className="p-2 rounded-lg grow outline-0 bg-dark"
                    name="selectCuisine"
                    onChange={(e) => setRecipeCuisine(e.target.value)}
                    value={recipeCuisine}
                >
                    <option key="N/A">N/A</option>
                    {allCuisines.map((cuisine) => (
                        <option key={cuisine.id}>{cuisine.name}</option>
                    ))}
                </select>
            </div>

            <label className="font-bold">Privacy:</label>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-dark">
                <PrivacyLogo fill="currentColor" className="w-10 h-10" />
                <select
                    className="p-2 rounded-lg grow outline-0 bg-dark"
                    name="selectPrivacy"
                    onChange={(e) => setRecipePrivacy(e.target.value)}
                    value={recipePrivacy}
                >
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                </select>
            </div>

            <label className="font-bold">Description:</label>
            <textarea
                className="w-full p-4 rounded-lg resize-none sm:h-40 lg:h-100 bg-dark "
                value={recipeDescription}
                placeholder={recipe?.description}
                onChange={(e) => setRecipeDescription(e.target.value)}
                maxLength={200}
            ></textarea>

            {originalImageUrl && (
                <div className="flex flex-col gap-4">
                    <label className="font-bold">Current Image:</label>
                    <img
                        src={recipeImageUrl}
                        alt="Current Image"
                        className="mx-auto rounded-lg sm:w-90 h-50" // Add your desired styles
                    />
                </div>
            )}
            <label className="font-bold">Upload new Image:</label>
            <label className="flex items-center justify-center w-full p-2 text-center border-2 border-solid rounded-lg cursor-pointer bg-dark">
                <UploadLogo fill="currentColor" className="w-10 h-10" />
                <p className="flex-grow ">Upload Image</p>
                <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
            </label>

            {recipeImagePreviewUrl && (
                <img
                    src={recipeImagePreviewUrl}
                    alt="Image Preview"
                    className="mx-auto rounded-lg sm:w-90 h-50"
                />
            )}

            <input
                className="py-2 mx-auto bg-green-600 rounded-lg w-80 h-14 hover:bg-green-700"
                type="submit"
                value="Submit Changes"
                onClick={handleSubmit}
            />
        </form>
    );
};

export default RecipeEditForm;
