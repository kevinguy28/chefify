import { useState, useEffect } from "react";
import { readRecipes } from "@/endpoints/api";
import RecipeCatalog from "./RecipeCatalog";

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
            undefined
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
        <div className="flex flex-wrap gap-y-4 justify-evenly items-center">
            <RecipeCatalog
                recipes={recipes}
                currentPage={currentPage}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                traverseMode={false}
                editMode={true}
                fetchRecipes={fetchRecipes}
            />
        </div>
    );
};

export default RecipeEditCatalog;
