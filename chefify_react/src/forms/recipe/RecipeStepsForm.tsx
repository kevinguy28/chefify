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
            await createRecipeStep(
                String(recipeId),
                stepTitle,
                stepDescription
            );
        }
    };

    return (
        <div>
            <form className="sm:w-4/5 lg:h-[calc(100vh-48px)] mx-auto sticky top-12 flex flex-col justify-center p-4 gap-4">
                <h1 className="font-bold text-xl">Add Steps to your Recipe</h1>
                <div>
                    <label className="text-xl">Title</label>
                    <hr />
                    <br />
                    <input
                        className="w-full p-4 bg-duck-yellow text-alt-text  rounded-xl"
                        placeholder="Name of Step"
                        type="text"
                        onChange={(e) => setStepTitle(e.target.value)}
                    />
                    <br />
                </div>
                <div className="w-full flex flex-col flex-grow">
                    <label className="text-xl">Description</label>
                    <hr />
                    <br />
                    <textarea
                        className="sm:h-100 lg:h-auto p-4 bg-duck-yellow text-alt-text  rounded-xl resize-none flex-grow"
                        name="textarea"
                        onChange={(e) => setStepDescription(e.target.value)}
                    ></textarea>
                    <br />
                </div>
                <hr />
                <input
                    className="w-full py-4 bg-duck-pale-yellow hover:bg-white text-alt-text  rounded-lg"
                    type="submit"
                    value="Submit Step"
                    onClick={handleSubmit}
                />
            </form>
        </div>
    );
};

export default RecipeStepsForm;
