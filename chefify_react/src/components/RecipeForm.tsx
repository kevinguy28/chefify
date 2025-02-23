import React, { useState, useEffect } from "react";
import { get_cuisines } from "@/endpoints/api";

const RecipeForm = () => {
    const [recipeName, setRecipeName] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [privacy, setPrivacy] = useState("private");
    const [recipeCuisine, setRecipeCuisine] = useState<Array<any>>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        create_recipe();
    };

    useEffect(() => {
        const fetchCuisines = async () => {
            const cuisines = await get_cuisines();
            if (Array.isArray(cuisines)) {
                console.log(cuisines);
                setRecipeCuisine(cuisines);
            }
        };
        fetchCuisines();
    }, []);

    return (
        <form>
            <label>Recipe Name</label>
            <br />
            <input
                placeholder="Name of Recipe"
                value={recipeName}
                name="selectRecipeName"
                type="text"
                onChange={(e) => setPrivacy(e.target.value)}
            />
            <br />
            <select
                name="selectCuisine"
                onChange={(e) => setCuisine(e.target.value)}
                value={cuisine}
            >
                <option key="N/A">N/A</option>
                {recipeCuisine.map((cuisine) => (
                    <option key={cuisine.id}>
                        {cuisine.name} <br />
                    </option>
                ))}
            </select>
            <br />
            <select
                name="selectPrivacy"
                onChange={(e) => setPrivacy(e.target.value)}
                value={privacy}
            >
                <option key={"private"}>Private</option>
                <option key={"public"}>Public</option>
                <option key={"friends"}>Friends</option>
            </select>
            <br />
            <div onClick={handleSubmit}>Create Recipe</div>
        </form>
    );
};

export default RecipeForm;
