import { useEffect, useState } from "react";
import { deleteRecipeStep, readRecipeSteps } from "@/endpoints/api";
import { useParams } from "react-router-dom";
const RecipeStepsDisplay = () => {
    const { recipeId } = useParams();

    const [recipeSteps, setRecipeSteps] = useState<Array<any>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    const handleDelete = async (stepId: Number) => {
        const response = await deleteRecipeStep(String(stepId));
        if (response) {
            setLoaded(false);
        }
    };

    useEffect(() => {
        const fetchSteps = async () => {
            const response = await readRecipeSteps(String(recipeId));
            if (response) {
                setRecipeSteps(response);
                setLoaded(true);
            }
        };
        if (!loaded) {
            fetchSteps();
        }
    }, [loaded]);
    return (
        <div className="p-4">
            {recipeSteps.map((step) => (
                <>
                    <div className="bg-blue-400 p-2 rounded-xl" key={step.id}>
                        <h1 className="font-bold text-xl">
                            Step - {step.order}: {step?.title}
                        </h1>
                        <p>{step?.description}</p>
                        <div
                            className="ml-auto"
                            onClick={() => handleDelete(step.id)}
                        >
                            Delete
                        </div>
                    </div>
                    <br />
                </>
            ))}
        </div>
    );
};

export default RecipeStepsDisplay;
