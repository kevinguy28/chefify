import React, { useEffect, useState } from "react";
import {
    deleteIngredientUserProfile,
    getIngredientUserProfile,
} from "@/endpoints/api";
import { Ingredient } from "@/interfaces/interfaces";
import ShoppingListForm from "@/forms/ShoppingListForm";
import UserProfileIngredientListCard from "@/components/UserProfileIngredientListCard";

const Shoppinglist = () => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [ownedShoppingList, setOwnedShoppingList] = useState<Array<any>>([]);
    const [buyShoppingList, setBuyShoppingList] = useState<Array<any>>([]);
    const [dairyOpen, setDairyOpen] = useState<boolean>(false);
    const [fruitsVegetablesOpen, setFruitsVegetablesOpen] =
        useState<boolean>(false);
    const [grainsOpen, setGrainsOpen] = useState<boolean>(false);
    const [herbsSpicesOpen, setHerbsSpicesOpen] = useState<boolean>(false);
    const [proteinOpen, setProteinOpen] = useState<boolean>(false);
    const [otherOpen, setOtherOpen] = useState<boolean>(false);

    const capitalizeFirstLetter = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    const fetchList = async () => {
        const response = await getIngredientUserProfile("false");
        if (response) {
            setOwnedShoppingList(
                response.data.ownedIngredients.map(
                    (ingredient: Ingredient) => ({
                        ...ingredient,
                        name: capitalizeFirstLetter(ingredient.name),
                    })
                )
            );
            setBuyShoppingList(
                response.data.buyIngredients.map((ingredient: Ingredient) => ({
                    ...ingredient,
                    name: capitalizeFirstLetter(ingredient.name),
                }))
            );
            console.log(
                response.data.buyIngredients.map((ingredient: Ingredient) => ({
                    ...ingredient,
                    name: capitalizeFirstLetter(ingredient.name),
                }))
            );
        }
        setLoaded(true);
    };

    const handleDelete = async (id: number) => {
        const response = await deleteIngredientUserProfile("false", id);
        if (response) {
            setBuyShoppingList((prevList) =>
                prevList.filter((item) => item.id !== id)
            );
        }
    };

    useEffect(() => {
        if (!loaded) {
            fetchList();
        } else {
            console.log("Final");
        }
    }, [loaded]);

    const openList = (
        e: React.MouseEvent<HTMLDivElement>,
        category: string
    ) => {
        const container = document.getElementById(`${category}Container`);
        const ingredients = document.querySelectorAll(`.${category}-SL`);
        if (!eval(`${category}Open`)) {
            container?.classList.remove("max-h-16");
            container?.classList.add("h-auto");
            ingredients.forEach((ingredient) => {
                ingredient.classList.remove("hidden");
            });
            eval(`set${capitalizeFirstLetter(category)}Open(true);`);
            console.log(dairyOpen);
        } else {
            container?.classList.remove("h-auto");
            container?.classList.add("max-h-16");
            ingredients.forEach((ingredient) => {
                ingredient.classList.add("hidden");
            });
            eval(`set${capitalizeFirstLetter(category)}Open(false);`);
        }
    };

    return (
        <div className="flex justify-center gap-4 p-4">
            <UserProfileIngredientListCard isOwned={false} />
        </div>
    );
};

export default Shoppinglist;
