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

    const submitSearch = async (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault();
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
                <div className="flex flex-col items-center gap-4">
                    <div>
                        <div className="flex w-70 p-1 bg-duck-yellow rounded-2xl shadow-[0_5px_10px_#f08b5c,_0_0_0_5px] mb-4 ">
                            <input
                                className=" rounded-l-md p-2 outline-none"
                                placeholder="Recipe Name"
                                name="selectRecipeName"
                                type="text"
                                onChange={(e) => setFilterInput(e.target.value)}
                            />
                            <svg
                                className="bg-duck-yellow rounded-r-md pr-1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                                width="50px"
                                height="50px"
                            >
                                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                            </svg>
                        </div>

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
                    </div>
                    <div onClick={(e) => submitSearch(e)}>Submit</div>
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
