import { useState, useEffect } from "react";
import Banner from "../components/Banner";
import { get_recipes, logout } from "../endpoints/api";
import { useNavigate } from "react-router-dom";
import "../index.css";
import RecipeForm from "@/components/RecipeForm";

const Home = () => {
    const [recipeCard, setRecipeCard] = useState<Array<any>>([]);

    const nav = useNavigate();

    useEffect(() => {
        const fetchRecipes = async () => {
            const recipeCards = await get_recipes();
            if (Array.isArray(recipeCards)) {
                setRecipeCard(recipeCards);
            }
        };
        fetchRecipes();
    }, []);

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            nav("/login");
        }
    };

    return (
        <div>
            <Banner />
            <div className="grid grid-cols-[2fr_5fr_2fr]">
                <div>g</div>
                <div>
                    g
                    {recipeCard.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="rounded-xl bg-white p-4"
                        >
                            <img
                                src={recipe.image.url}
                                className="rounded-xl"
                                alt={recipe.name}
                            />
                            <h1>{recipe.name}</h1>
                            <p>{recipe.description}</p>
                        </div>
                    ))}
                </div>
                <div>
                    <RecipeForm />
                </div>
            </div>
            <h1 className="text-3xl font-bold underline">Hello world!</h1>
            <div onClick={handleLogout} className="bg-red-300">
                logout
            </div>
        </div>
    );
};

export default Home;
