import { useEffect, useState, useRef } from "react";
import { deleteRecipeStep, readRecipeSteps } from "@/endpoints/api";
import { useParams } from "react-router-dom";
import { updateRecipeStepOrder } from "@/endpoints/api";

import arrowUp from "@/assets/arrow-up.svg";
import arrowDown from "@/assets/arrow-down.svg";

const RecipeStepsDisplay = () => {
    const { recipeId } = useParams();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [recipeSteps, setRecipeSteps] = useState<Array<any>>([]);
    const [stepDescription, setStepDescription] = useState<string>("");
    const [editing, setEditing] = useState<boolean>(false);
    const [editStepId, setEditStepId] = useState<number | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"; // Reset height
            textareaRef.current.style.height =
                textareaRef.current.scrollHeight + "px";
        }
    };

    const loadData = async () => {
        const response = await readRecipeSteps(String(recipeId));
        if (response) {
            setRecipeSteps(response);
            setLoaded(true);
        }
    };

    const handleEdit = async (description: string, stepId: number) => {
        console.log("edit");
        if (editing) {
            setStepDescription("");
            setEditing(false);
            setEditStepId(null);
        } else {
            setEditing(true);
            setEditStepId(stepId);
            setStepDescription(description);
        }
    };

    const handleDelete = async (stepId: Number) => {
        const response = await deleteRecipeStep(String(stepId));
        if (response) {
            setLoaded(false);
        }
    };

    const handleSwap = async (stepId: Number, moveDown: boolean) => {
        const response = await updateRecipeStepOrder(String(stepId), moveDown);
        if (response) {
            setLoaded(false);
        }
    };

    useEffect(() => {
        if (!loaded) {
            loadData();
        }
    }, [loaded, editing]);

    useEffect(() => {
        adjustHeight();
    }, [stepDescription]);

    return (
        <div className="p-4 sm:w-4/5 lg:w-full mx-auto">
            {recipeSteps.length > 0 ? (
                recipeSteps.map((step, index) => (
                    <>
                        <div
                            className="bg-dark-light p-2 rounded-xl"
                            key={step.id}
                        >
                            <h1 className="font-bold text-xl flex gap-4">
                                <span>
                                    Step - {step.order}: {step?.title}
                                </span>
                                <div className="flex flex-row flex-grow gap-4 justify-end">
                                    {index !== recipeSteps?.length - 1 && (
                                        <img
                                            src={arrowDown}
                                            alt="Arrow Down"
                                            className="w-5 h-5 ml-2"
                                            onClick={() =>
                                                handleSwap(step.id, true)
                                            }
                                        />
                                    )}
                                    {index !== 0 && (
                                        <img
                                            src={arrowUp}
                                            alt="Arrow Up"
                                            className="w-5 h-5 ml-2"
                                            onClick={() =>
                                                handleSwap(step.id, false)
                                            }
                                        />
                                    )}
                                </div>
                            </h1>
                            <hr />
                            <br />

                            <div>
                                {editing && editStepId === step?.id ? (
                                    <form>
                                        <textarea
                                            ref={textareaRef}
                                            className="w-full p-2 border rounded-md resize-none overflow-hidden"
                                            value={stepDescription}
                                            rows={1}
                                        ></textarea>
                                    </form>
                                ) : (
                                    <p>{step?.description}</p>
                                )}
                            </div>
                            <br />
                            <div className="flex gap-4 justify-end">
                                <span
                                    onClick={() =>
                                        handleEdit(step?.description, step?.id)
                                    }
                                >
                                    {editing
                                        ? editStepId === step?.id
                                            ? "Save"
                                            : ""
                                        : "Edit"}
                                </span>
                                <span
                                    className="cursor-pointer text-red-500 hover:text-red-300"
                                    onClick={() => handleDelete(step.id)}
                                >
                                    Delete
                                </span>
                            </div>
                        </div>
                        <br />
                    </>
                ))
            ) : (
                <div>gg</div>
            )}
        </div>
    );
};

export default RecipeStepsDisplay;
