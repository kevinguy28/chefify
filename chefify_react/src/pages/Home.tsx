import { useState, useEffect } from "react";
import Banner from "../components/Banner";
import { get_recipes, logout } from "../endpoints/api";
import { useNavigate } from "react-router-dom";
import "../index.css";
import RecipeForm from "@/components/RecipeForm";

const Home = () => {
    const [recipeCard, setRecipeCard] = useState<Array<any>>([]);

    const nav = useNavigate();

    const handleLogout = async () => {
        console.log("hello");
        const success = await logout();

        if (success) {
            nav("/login");
        }
    };

    useEffect(() => {
        const fetchRecipes = async () => {
            const recipeCards = await get_recipes();
            if (Array.isArray(recipeCards)) {
                setRecipeCard(recipeCards);
            }
        };
        fetchRecipes();
    }, []);

    return (
        <div>
            <Banner />
            <div className="grid grid-cols-[2fr_5fr_2fr] mt-8 ">
                <div></div>
                <div className="flex flex-wrap gap-4 justify-evenly items-center bg-red-400">
                    {recipeCard.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="rounded-xl bg-white w-80"
                        >
                            <img
                                className="rounded-t-xl w-full max-h-50"
                                alt={recipe.name}
                                src={`http://localhost:8000${recipe.image}`} // Make sure to add the image source
                            />
                            <h1 className="p-2">{recipe.name}</h1>
                            <p className="p-2">{recipe.description}</p>
                        </div>
                    ))}
                </div>

                <div>
                    <RecipeForm />
                </div>
            </div>
            <div onClick={handleLogout} className="ml-auto">
                Logout
            </div>
        </div>
    );
};

export default Home;
