import { useEffect, useState, useRef } from "react";
import { deleteRecipeStep, readRecipeSteps } from "@/endpoints/api";
import { useParams } from "react-router-dom";
import { updateRecipeStep, updateRecipeStepOrder } from "@/endpoints/api";

import arrowUp from "@/assets/arrow-up.svg";
import arrowDown from "@/assets/arrow-down.svg";

const RecipeStepsDisplay = ({ edit }: { edit: boolean }) => {
    const { recipeId } = useParams();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [recipeSteps, setRecipeSteps] = useState<Array<any>>([]);
    const [stepTitle, setStepTitle] = useState<string>("");
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

    const handleDelete = async (stepId: Number) => {
        const response = await deleteRecipeStep(String(stepId));
        if (response) {
            setLoaded(false);
        }
    };

    const handleEdit = async (
        stepId: number,
        originalTitle: string,
        originalDescription: string
    ) => {
        if (editing) {
            if (
                stepDescription !== originalDescription ||
                stepTitle !== originalTitle
            ) {
                const response = await updateRecipeStep(
                    String(stepId),
                    stepTitle,
                    stepDescription
                );
                if (response) {
                    setLoaded(false);
                }
            }
            setStepTitle("");
            setStepDescription("");
            setEditing(false);
            setEditStepId(null);
        } else {
            setEditing(true);
            setEditStepId(stepId);
            setStepTitle(originalTitle);
            setStepDescription(originalDescription);
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
        <div className="px-4 sm:w-4/5 lg:w-full mx-auto ">
            {recipeSteps.length > 0 ? (
                recipeSteps.map((step, index) => (
                    <>
                        <div
                            className="bg-dark-light p-2 rounded-xl"
                            key={step.id}
                        >
                            <h1 className="font-bold text-xl flex gap-4">
                                {editing && editStepId === step?.id ? (
                                    <div className="flex flex-col w-full">
                                        <div>Step - {step.order}:</div>
                                        <textarea
                                            className="w-full p-2 border rounded-md resize-none overflow-hidden"
                                            value={stepTitle}
                                            onChange={(e) =>
                                                setStepTitle(e.target.value)
                                            }
                                        ></textarea>
                                    </div>
                                ) : (
                                    <span>
                                        Step - {step.order}: {step?.title}
                                    </span>
                                )}
                                <div className="flex flex-row flex-grow gap-4 justify-end">
                                    {index !== recipeSteps?.length - 1 &&
                                        edit && (
                                            <img
                                                src={arrowDown}
                                                alt="Arrow Down"
                                                className="w-5 h-5 ml-2"
                                                onClick={() =>
                                                    handleSwap(step.id, true)
                                                }
                                            />
                                        )}
                                    {index !== 0 && edit && (
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
                                            onChange={(e) =>
                                                setStepDescription(
                                                    e.target.value
                                                )
                                            }
                                        ></textarea>
                                    </form>
                                ) : (
                                    <p>{step?.description}</p>
                                )}
                            </div>
                            <br />
                            <div className="flex gap-4 justify-end">
                                {edit && (
                                    <>
                                        <span
                                            className="hover:text-duck-yellow"
                                            onClick={() =>
                                                handleEdit(
                                                    step?.id,
                                                    step?.title,
                                                    step?.description
                                                )
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
                                            onClick={() =>
                                                handleDelete(step.id)
                                            }
                                        >
                                            Delete
                                        </span>
                                    </>
                                )}
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
