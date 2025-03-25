import { useState, useEffect } from "react";
import { readRecipes, logout } from "../endpoints/api";
import { useNavigate } from "react-router-dom";
import "../index.css";
import RecipeForm from "@/forms/recipe/RecipeForm";
import RecipeCatalog from "@/components/RecipeCatalog";
import { readCuisines } from "../endpoints/api";
import ShoppingListForm from "@/forms/ShoppingListForm";

const Home = () => {
    const [cuisine, setCuisine] = useState("");
    const [recipeCuisine, setRecipeCuisine] = useState<Array<any>>([]);
    const [recipes, setRecipes] = useState<Array<any>>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrevious, setHasPrevious] = useState<boolean>(false);
    const [totalPages] = useState<number | null>(null);
    const [filterInput, setFilterInput] = useState<string>("");

    const fetchRecipes = async (page: number) => {
        const response = await readRecipes(page, false, "public");
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

    const submitSearch = async () => {
        if (!(cuisine.length == 0 && filterInput.length == 0)) {
            const response = await readRecipes(
                1,
                false,
                "public",
                filterInput,
                cuisine
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
        <div>
            <div className="grid grid-cols-[2fr_5fr_2fr] mt-8 max-w-screen-2xl mx-auto">
                <div className="bg-amber-900">
                    <input
                        className="w-70 p-4 bg-duck-yellow rounded-xl"
                        placeholder="Filter Name"
                        name="selectRecipeName"
                        type="text"
                        onChange={(e) => setFilterInput(e.target.value)}
                    />
                    <select
                        className="w-70  p-4 bg-duck-yellow rounded-xl"
                        name="selectCuisine"
                        onChange={(e) => setCuisine(e.target.value)}
                        value={cuisine}
                    >
                        <option key="N/A">N/A</option>
                        {recipeCuisine.map((cuisine) => (
                            <option key={cuisine.id}>{cuisine.name}</option>
                        ))}
                    </select>
                    <div onClick={submitSearch}>Submit</div>
                    <div onClick={() => fetchRecipes(1)}>Clear</div>
                </div>
                <div>
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
                <div>
                    <RecipeForm />
                </div>
            </div>
        </div>
    );
};

export default Home;
