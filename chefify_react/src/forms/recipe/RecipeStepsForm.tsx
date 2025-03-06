import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createRecipeStep } from "@/endpoints/api";
const RecipeStepsForm = () => {
    const { recipeId } = useParams();

    const [stepTitle, setStepTitle] = useState<string>("");
    const [stepDescription, setStepDescription] = useState<string>("");

    useEffect(() => {}, []);

    const handleSubmit = async () => {
        if (stepTitle.trim() === "") {
            alert("Title cannot be left empty!");
        } else if (stepDescription.trim() === "") {
            alert("The description of the steps cannot be left");
        } else {
            const addRecipeStep = await createRecipeStep(
                String(recipeId),
                stepTitle,
                stepDescription
            );
        }
    };

    return (
        <div>
            <form className="flex flex-col justify-center p-4 gap-4">
                <h1 className="w-100 mx-auto font-bold text-xl">
                    Add Steps to your Recipe
                </h1>
                <div className="w-100 mx-auto">
                    <label className="font-bold text-xl">Title</label>
                    <br />
                    <input
                        className="w-full p-4 mx-auto bg-duck-yellow rounded-xl"
                        placeholder="Name of Step"
                        type="text"
                        onChange={(e) => setStepTitle(e.target.value)}
                    />
                    <br />
                </div>
                <div className="w-100 mx-auto">
                    <label className="font-bold text-xl">Description</label>
                    <textarea
                        className="w-full p-4 mx-auto bg-duck-yellow rounded-xl resize-none"
                        name="textarea"
                        rows={20}
                        cols={60}
                        onChange={(e) => setStepDescription(e.target.value)}
                    ></textarea>
                    <br />
                </div>
                <input
                    className="w-100 mx-auto py-4  bg-duck-dark-orange rounded-lg hover:bg-duck-yellow font-bol"
                    type="submit"
                    value="Submit Step"
                    onClick={handleSubmit}
                />
            </form>
        </div>
    );
};

export default RecipeStepsForm;
