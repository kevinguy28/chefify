import { useState, useEffect } from "react";
import RecipeEditForm from "@/forms/recipe/RecipeEditForm";
import RecipeStepsForm from "@/forms/recipe/RecipeStepsForm";
import RecipeStepsDisplay from "@/display/RecipeStepsDisplay";
import { Recipe, RecipeComponent } from "@/interfaces/interfaces";
import { readRecipe, readRecipeComponent } from "@/endpoints/api";
import { useParams } from "react-router-dom";
import RecipeIngredientForm from "@/forms/recipe/RecipeIngredientForm";
import RecipeComponentDisplay from "@/display/RecipeComponentDisplay";
import RecipeEditPageState from "@/components/RecipeEditPageState";

const RecipeEdit = () => {
    const pageModes = {
        editRecipe: "Edit Recipe",
        addStep: "Add Step",
        addIngredient: "Add Ingredient",
    } as const;

    type PageMode = keyof typeof pageModes;

    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [recipeComponents, setRecipeComponents] = useState<Array<any>>([]);
    const [fetchIngredients, setFetchIngredients] = useState<boolean>(false);
    const [pageState, setPageState] = useState<PageMode>("editRecipe");

    const fetchRecipe = async () => {
        const response = await readRecipe(String(recipeId));
        if (response) {
            setRecipe(response);
            setLoaded(true);
        }
    };

    const fetchRecipeComponents = async () => {
        if (recipe) {
            const response = await readRecipeComponent(recipe.id.toString());
            if (response) {
                setRecipeComponents(response);
            }
        }
    };

    const updateRecipeComponents = async (componentId: number) => {
        setRecipeComponents(
            recipeComponents.filter((component) => component.id !== componentId)
        );
    };

    const updateRecipeComponentsAdd = async (component: RecipeComponent) => {
        setRecipeComponents([...recipeComponents, component]);
    };

    useEffect(() => {
        if (!loaded) {
            fetchRecipe();
        }
    }, [loaded]);

    useEffect(() => {
        fetchRecipeComponents();
    }, [recipe]);

    return (
        <div className="overflow-hidden">
            <div className="mx-auto mb-4 sm:w-160 sm:hidden lg:block ">
                <RecipeEditPageState
                    setPageState={setPageState}
                    pageState={pageState}
                />
            </div>
            <div className=" sm:flex sm:flex-col lg:grid lg:grid-cols-[1fr_1fr] gap-0 lg:w-256 xl:w-280 mx-auto ">
                <div
                    className={` sm:mx-auto lg:mx-0 p-4 sm:w-160 lg:w-128 xl:w-140 overflow-y-auto scrollbar lg:max-h-screen`}
                >
                    <div
                        className={`sm:flex sm:flex-col sm:gap-4 mx-auto 
                         `}
                    >
                        <div className="mx-auto bg-dark sm:w-120">
                            <img
                                className="w-full "
                                alt={recipe?.name ?? "Recipe Image"}
                                src={
                                    recipe?.image
                                        ? `http://localhost:8000${recipe.image}`
                                        : `http://localhost:8000/media/images/recipes/default-recipe.png`
                                }
                            />

                            <div className="flex flex-col gap-2 p-4 ">
                                <h1 className="text-lg font-bold">
                                    {recipe?.name}
                                </h1>
                                <p className="text-sm">
                                    {recipe?.cuisine.name} |{" "}
                                    {recipe?.user.username}
                                </p>

                                <p className="text-sm text-darker-text">
                                    {recipe?.description}
                                </p>
                            </div>
                        </div>
                        <h1 className="mx-auto text-lg font-bold sm:w-120">
                            Recipe Components
                        </h1>
                        <RecipeComponentDisplay
                            updateRecipeComponents={updateRecipeComponents}
                            recipeComponents={recipeComponents}
                            fetchIngredients={fetchIngredients}
                            setFetchIngredients={setFetchIngredients}
                        />
                        <h1 className="mx-auto text-lg font-bold sm:w-120">
                            Recipe Steps
                        </h1>
                        <div className="mx-auto">
                            <RecipeStepsDisplay edit={true} />
                        </div>
                    </div>
                </div>
                <div className="mx-auto sm:w-160 sm:block lg:hidden">
                    <RecipeEditPageState
                        setPageState={setPageState}
                        pageState={pageState}
                    />
                </div>
                <div className="p-4 sm:mx-auto lg:mx-0 sm:w-160 lg:w-128 sm:flex sm:flex-col sm:gap-4 xl:w-140 ">
                    <div
                        className={`${
                            pageState !== "editRecipe" && "hidden"
                        } overflow-y-auto scrollbar lg:max-h-screen`}
                    >
                        <h1 className="mx-auto text-lg font-bold sm:w-120">
                            Edit Recipe
                        </h1>
                        <RecipeEditForm recipe={recipe} setLoaded={setLoaded} />
                    </div>
                    <div
                        className={`${
                            pageState !== "addStep" && "hidden"
                        } overflow-y-auto scrollbar lg:max-h-screen`}
                    >
                        <h1 className="mx-auto text-lg font-bold sm:w-120">
                            Add Steps to Recipe
                        </h1>
                        <RecipeStepsForm />
                    </div>
                    <div
                        className={`${
                            pageState !== "addIngredient" && "hidden"
                        } overflow-y-auto scrollbar lg:max-h-screen`}
                    >
                        {recipe && (
                            <>
                                <h1 className="mx-auto text-lg font-bold sm:w-120">
                                    Add a Recipe Component
                                </h1>{" "}
                                <RecipeIngredientForm
                                    recipe={recipe}
                                    recipeComponents={recipeComponents}
                                    updateRecipeComponentsAdd={
                                        updateRecipeComponentsAdd
                                    }
                                    setFetchIngredients={setFetchIngredients}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeEdit;
