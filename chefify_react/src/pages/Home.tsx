import { useState, useEffect } from "react";
import Banner from "../components/Banner";
import { readRecipes, logout } from "../endpoints/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/useAuth";
import "../index.css";
import RecipeForm from "@/forms/recipe/RecipeForm";
import RecipeCard from "@/components/RecipeCard";

const Home = () => {
    const [recipes, setRecipes] = useState<Array<any>>([]);
    const [loaded, setLoaded] = useState<Boolean>(false);
    const { user } = useAuth();
    const nav = useNavigate();

    const fetchRecipes = async () => {
        const response = await readRecipes();
        if (Array.isArray(response)) {
            setRecipes(response);
            setLoaded(true);
        }
    };

    const handleLogout = async () => {
        const success = await logout();

        if (success) {
            nav("/login");
        }
    };

    useEffect(() => {
        if (!loaded) {
            fetchRecipes();
        }
    }, [loaded]);

    return (
        <div>
            <div className="grid grid-cols-[2fr_5fr_2fr] mt-8 max-w-screen-2xl mx-auto">
                <div>ss</div>
                <div className="flex flex-wrap gap-y-4 justify-evenly items-center">
                    {recipes &&
                        recipes.map((recipe) => <RecipeCard recipe={recipe} />)}
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
