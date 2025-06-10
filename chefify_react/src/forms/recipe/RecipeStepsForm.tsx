import { useEffect, useState } from "react";
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
        <form className="flex flex-col justify-center gap-4 p-4 mx-auto sm:w-120">
            <label className="font-bold">Title:</label>
            <input
                className="p-4 rounded-md bg-dark"
                placeholder="Type title"
                type="text"
                onChange={(e) => setStepTitle(e.target.value)}
            />
            <label className="font-bold">Description:</label>
            <textarea
                className="flex-grow p-4 rounded-md resize-none sm:h-100 lg:h-auto bg-dark"
                placeholder="Type description"
                name="textarea"
                onChange={(e) => setStepDescription(e.target.value)}
            ></textarea>
            <input
                className="py-2 mx-auto bg-green-600 rounded-lg w-80 h-14 hover:bg-green-700"
                type="submit"
                value="Submit Step"
                onClick={handleSubmit}
            />
        </form>
    );
};

export default RecipeStepsForm;
