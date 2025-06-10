import { useState, useEffect } from "react";
import { readRecipes } from "@/endpoints/api";
import RecipeCatalog from "./RecipeCatalog";
import { Link } from "react-router-dom";
import RecipeContainer from "./RecipeContainer";
import Edit from "@/assets/edit.svg?react";

const RecipeEditCatalog = () => {
    const [cuisine, setCuisine] = useState("");
    const [recipeCuisine, setRecipeCuisine] = useState<Array<any>>([]);
    const [recipes, setRecipes] = useState<Array<any>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrevious, setHasPrevious] = useState<boolean>(false);
    const [totalPages] = useState<number | null>(null);

    const fetchRecipes = async (page: number) => {
        const response = await readRecipes(
            page,
            true,
            undefined,
            undefined,
            undefined,
            undefined,
            12
        );
        if (response) {
            setCurrentPage(response.page);
            setHasNext(response.hasNext);
            setHasPrevious(response.hasPrevious);
            setRecipes(response.recipes);
        }
    };

    useEffect(() => {
        if (!loaded) {
            fetchRecipes(1);
            setLoaded(true);
        }
    }, [loaded]);

    return (
        <div className="flex flex-col gap-4 p-4 mx-auto mt-8 max-w-screen-2xl">
            <div className="flex items-center gap-4 mx-auto">
                <Edit fill="currentColor" className="w-10 h-10 " />
                <div className="text-3xl font-bold">Edit Recipes </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 ">
                {recipes.map((recipe) => (
                    <Link to={`/recipe/update/${recipe?.id}`} className="p-2">
                        <RecipeContainer recipe={recipe} edit={true} />
                    </Link>
                ))}
            </div>
            <div className="relative flex justify-center my-10 ">
                <span className="relative font-bold">
                    {hasPrevious && (
                        <span
                            className="absolute cursor-pointer right-20"
                            onClick={() => fetchRecipes(currentPage - 1)}
                        >
                            Previous
                        </span>
                    )}
                    {currentPage}
                    {hasNext && (
                        <span
                            className="absolute cursor-pointer left-20"
                            onClick={() => fetchRecipes(currentPage + 1)}
                        >
                            Next
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default RecipeEditCatalog;
