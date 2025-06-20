import { useState, useEffect } from "react";
import { readRecipes } from "../endpoints/api";
import "../index.css";
import RecipeForm from "@/forms/recipe/RecipeForm";
import RecipeCatalog from "@/components/RecipeCatalog";
import { readCuisines } from "../endpoints/api";
import RecipeQuery from "@/forms/recipe/RecipeQuery";

const Home = () => {
    const [cuisine, setCuisine] = useState("");
    const [recipeCuisine, setRecipeCuisine] = useState<Array<any>>([]);
    const [recipes, setRecipes] = useState<Array<any>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrevious, setHasPrevious] = useState<boolean>(false);
    const [filterInput, setFilterInput] = useState<string>("");
    const [recent, setRecent] = useState<boolean>(true);

    const fetchRecipes = async (page: number) => {
        const response = await readRecipes(
            page,
            false,
            "public",
            undefined,
            undefined,
            "true",
            undefined
        );
        if (response) {
            setCurrentPage(response.page);
            setHasNext(response.hasNext);
            setHasPrevious(response.hasPrevious);
            setRecipes(response.recipes);
        }
    };

    const fetchCuisines = async () => {
        const cuisines = await readCuisines();
        if (Array.isArray(cuisines)) {
            setRecipeCuisine(cuisines);
        }
    };

    const submitSearch = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
        {
            const response = await readRecipes(
                1,
                false,
                "public",
                filterInput,
                cuisine,
                recent.toString()
            );
            if (response) {
                setCurrentPage(response.page);
                setHasNext(response.hasNext);
                setHasPrevious(response.hasPrevious);
                setRecipes(response.recipes);
            }
        }
    };

    useEffect(() => {
        if (!loaded) {
            fetchRecipes(1);
            fetchCuisines();
            setLoaded(true);
        }
    }, [loaded]);

    return (
        <div className="mt-8 max-w-screen-xl mx-auto  xl:grid grid-cols-[1fr_1fr] xl:grid-cols-[1fr_2fr] ">
            <div className="flex flex-col md:flex-row xl:flex-col xl:justify-start justify-center items-center md:items-start gap-8 p-8">
                <RecipeForm />
                <RecipeQuery
                    filterInput={filterInput}
                    setFilterInput={setFilterInput}
                    setCuisine={setCuisine}
                    cuisine={cuisine}
                    recipeCuisine={recipeCuisine}
                    submitSearch={submitSearch}
                    fetchRecipes={fetchRecipes}
                    recent={recent}
                    setRecent={setRecent}
                />
            </div>
            <div className="xl:py-8 ">
                <RecipeCatalog
                    recipes={recipes}
                    currentPage={currentPage}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                    traverseMode={true}
                    editMode={false}
                    fetchRecipes={fetchRecipes}
                />
            </div>
        </div>
    );
};

export default Home;
