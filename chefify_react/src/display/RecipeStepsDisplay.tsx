import { useEffect, useState, useRef } from "react";
import { deleteRecipeStep, readRecipeSteps } from "@/endpoints/api";
import { useParams } from "react-router-dom";
import { updateRecipeStep, updateRecipeStepOrder } from "@/endpoints/api";

import ArrowUp from "@/assets/arrow-up.svg?react";
import ArrowDown from "@/assets/arrow-down.svg?react";
import TrashLogo from "@/assets/trash.svg?react";
import EditLogo from "@/assets/edit.svg?react";
import SaveFloppy from "@/assets/saveFloppy.svg?react";

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
        <div className="flex flex-col gap-4 p-4 mx-auto sm:w-120">
            {recipeSteps.length > 0 ? (
                recipeSteps.map((step, index) => (
                    <div>
                        <div
                            className="flex flex-col gap-4 p-8 bg-dark-light sm:w-110"
                            key={step.id}
                        >
                            <h1 className="flex items-center justify-center gap-4 text-lg font-bold text-darker-text">
                                {editing && editStepId === step?.id ? (
                                    <div className="flex flex-col w-ful ">
                                        <div>Step {step.order}:</div>
                                        <textarea
                                            className="p-2 overflow-hidden text-lg border rounded-md resize-none "
                                            value={stepTitle}
                                            onChange={(e) =>
                                                setStepTitle(e.target.value)
                                            }
                                        ></textarea>
                                    </div>
                                ) : (
                                    <div className="text-lg">{step?.title}</div>
                                )}
                                <div className="flex flex-row items-center justify-end flex-grow gap-4">
                                    {index !== recipeSteps?.length - 1 &&
                                        edit && (
                                            <ArrowDown
                                                className="w-8 h-8 hover:text-duck-yellow"
                                                onClick={() =>
                                                    handleSwap(step.id, true)
                                                }
                                            />
                                        )}
                                    {index !== 0 && edit && (
                                        <ArrowUp
                                            className="w-8 h-8 hover:text-duck-yellow "
                                            onClick={() =>
                                                handleSwap(step.id, false)
                                            }
                                        />
                                    )}
                                </div>
                            </h1>

                            <div>
                                {editing && editStepId === step?.id ? (
                                    <form>
                                        <textarea
                                            ref={textareaRef}
                                            className="w-full p-2 overflow-hidden border rounded-md resize-none"
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
                                    <p className="text-sm text-darker-text">
                                        {step?.description}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center justify-end gap-4">
                                {edit && (
                                    <>
                                        <>
                                            <EditLogo
                                                className={`w-8 h-8 cursor-pointer hover:text-green-500 ${
                                                    editing &&
                                                    editStepId === step?.id
                                                        ? "hidden"
                                                        : "block"
                                                }`}
                                                onClick={() =>
                                                    handleEdit(
                                                        step?.id,
                                                        step?.title,
                                                        step?.description
                                                    )
                                                }
                                            />
                                            <SaveFloppy
                                                className={`w-8 h-8 cursor-pointer hover:text-green-500 ${
                                                    editing &&
                                                    editStepId === step?.id
                                                        ? "block"
                                                        : "hidden"
                                                }`}
                                                onClick={() =>
                                                    handleEdit(
                                                        step?.id,
                                                        step?.title,
                                                        step?.description
                                                    )
                                                }
                                            />
                                        </>
                                        <TrashLogo
                                            className="w-10 h-10 cursor-pointer hover:text-red-500"
                                            onClick={() =>
                                                handleDelete(step.id)
                                            }
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex justify-end text-sm text-darker-text">
                                {step.order}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div>The author has not written any steps!</div>
            )}
        </div>
    );
};

export default RecipeStepsDisplay;
