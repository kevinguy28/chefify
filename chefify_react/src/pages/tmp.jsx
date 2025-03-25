import React, { useEffect, useState } from "react";
import {
    deleteIngredientUserProfile,
    getIngredientUserProfile,
} from "@/endpoints/api";
import { Ingredient } from "@/interfaces/interfaces";
import ShoppingListForm from "@/forms/ShoppingListForm";

const Shoppinglist = () => {
    const [loaded, setLoaded] = useState < boolean > false;
    const [ownedShoppingList, setOwnedShoppingList] =
        useState < Array < any >> [];
    const [buyShoppingList, setBuyShoppingList] = useState < Array < any >> [];
    const [dairyOpen, setDairyOpen] = useState < boolean > false;
    const [fruitsVegetablesOpen, setFruitsVegetablesOpen] =
        useState < boolean > false;
    const [grainsOpen, setGrainsOpen] = useState < boolean > false;
    const [herbsSpicesOpen, setHerbsSpicesOpen] = useState < boolean > false;
    const [proteinOpen, setProteinOpen] = useState < boolean > false;
    const [otherOpen, setOtherOpen] = useState < boolean > false;

    const capitalizeFirstLetter = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1);

    const fetchList = async () => {
        const response = await getIngredientUserProfile();
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
            <div className="bg-dark p-4 rounded-xl h-180 w-100 flex flex-col justify-between overflow-auto">
                <div className="flex flex-col h-1/1">
                    <h1 className="text-4xl underline mb-4">Shopping List</h1>
                    <div className="grow overflow-y-auto scrollbar scrollbar-2 mb-4">
                        <div
                            id="dairyContainer"
                            className="bg-blue-dairy p-4 h-16 box-border"
                        >
                            <div className="flex justify-between">
                                <h1 className="font-bold">Dairy</h1>
                                <div
                                    id="dairyBtn"
                                    onClick={(e) => openList(e, "dairy")}
                                >
                                    {dairyOpen ? "---" : "X"}
                                </div>
                            </div>
                            <hr className={`w-1/1 ${!dairyOpen && "hidden"}`} />
                            {buyShoppingList.map((ingredient) => (
                                <>
                                    {" "}
                                    {ingredient.ingredientType === "dairy" && (
                                        <div className="flex justify-between">
                                            <div className="dairy-SL hidden py-1">
                                                {ingredient.name}
                                            </div>
                                            <div
                                                onClick={() =>
                                                    handleDelete(ingredient?.id)
                                                }
                                                className="dairy-SL hidden"
                                            >
                                                Del
                                            </div>
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                        <div
                            id="fruitsVegetablesContainer"
                            className="bg-green-fruitsVegetable p-4 h-16 box-border"
                        >
                            <div className="flex justify-between">
                                <h1 className="font-bold">
                                    Fruits & Vegetables
                                </h1>
                                <div
                                    id="fruitsVegetablesBtn"
                                    onClick={(e) =>
                                        openList(e, "fruitsVegetables")
                                    }
                                >
                                    {dairyOpen ? "---" : "X"}
                                </div>
                            </div>
                            <hr
                                className={`w-1/1 ${
                                    !fruitsVegetablesOpen && "hidden"
                                }`}
                            />
                            {buyShoppingList.map((ingredient) => (
                                <>
                                    {" "}
                                    {ingredient.ingredientType ===
                                        "fruitsVegetables" && (
                                        <div className="fruitsVegetables-SL hidden py-1">
                                            {ingredient.name}
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                        <div
                            id="grainsContainer"
                            className="bg-yellow-grains p-4 h-16 box-border"
                        >
                            <div className="flex justify-between">
                                <h1 className="font-bold">Grains</h1>
                                <div
                                    id="grainsBtn"
                                    onClick={(e) => openList(e, "grains")}
                                >
                                    {dairyOpen ? "---" : "X"}
                                </div>
                            </div>
                            <hr
                                className={`w-1/1 ${!grainsOpen && "hidden"}`}
                            />
                            {buyShoppingList.map((ingredient) => (
                                <>
                                    {" "}
                                    {ingredient.ingredientType === "grains" && (
                                        <div className="grains-SL hidden py-1">
                                            {ingredient.name}
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                        <div
                            id="herbsSpicesContainer"
                            className="bg-orange-herbsSpices p-4 h-16 box-border"
                        >
                            <div className="flex justify-between">
                                <h1 className="font-bold">Herbs & Spices</h1>
                                <div
                                    id="herbsSpicesBtn"
                                    onClick={(e) => openList(e, "herbsSpices")}
                                >
                                    {dairyOpen ? "---" : "X"}
                                </div>
                            </div>
                            <hr
                                className={`w-1/1 ${
                                    !herbsSpicesOpen && "hidden"
                                }`}
                            />
                            {buyShoppingList.map((ingredient) => (
                                <>
                                    {" "}
                                    {ingredient.ingredientType ===
                                        "herbsSpices" && (
                                        <div className="herbsSpices-SL hidden py-1">
                                            {ingredient.name}
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                        <div
                            id="proteinContainer"
                            className="bg-red-protein p-4 h-16 box-border"
                        >
                            <div className="flex justify-between">
                                <h1 className="font-bold">Protein</h1>
                                <div
                                    id="proteinBtn"
                                    onClick={(e) => openList(e, "protein")}
                                >
                                    {dairyOpen ? "---" : "X"}
                                </div>
                            </div>
                            <hr
                                className={`w-1/1 ${!proteinOpen && "hidden"}`}
                            />
                            {buyShoppingList.map((ingredient) => (
                                <>
                                    {" "}
                                    {ingredient.ingredientType ===
                                        "protein" && (
                                        <div className="protein-SL hidden py-1">
                                            {ingredient.name}
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                        <div
                            id="otherContainer"
                            className="bg-purple-other p-4 h-16 box-border"
                        >
                            <div className="flex justify-between">
                                <h1 className="font-bold">Other</h1>
                                <div
                                    id="otherBtn"
                                    onClick={(e) => openList(e, "other")}
                                >
                                    {dairyOpen ? "---" : "X"}
                                </div>
                            </div>
                            <hr className={`w-1/1 ${!otherOpen && "hidden"}`} />
                            {buyShoppingList.map((ingredient) => (
                                <>
                                    {" "}
                                    {ingredient.ingredientType === "other" && (
                                        <div className="other-SL hidden py-1">
                                            {ingredient.name}
                                        </div>
                                    )}
                                </>
                            ))}
                        </div>
                    </div>
                    <ShoppingListForm isOwned={false} setLoaded={setLoaded} />
                </div>
            </div>
        </div>
    );
};

export default Shoppinglist;
