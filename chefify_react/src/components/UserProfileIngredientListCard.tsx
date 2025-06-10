import { readIngredientUserProfile } from "@/endpoints/api";
import ShoppingListForm from "@/forms/ShoppingListForm";
import { UserProfileIngredientListCardProp } from "@/interfaces/interfaces";
import React, { useState, useEffect } from "react";
import DropDownMenu from "./DropDownMenu";

import cart from "@/assets/cart.png";
import checkmark from "@/assets/checkmark.png";

const UserProfileIngredientListCard: React.FC<
    UserProfileIngredientListCardProp
> = ({ isOwned, suffix, refresh, setRefresh }) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [dairy, setDairy] = useState<Array<any>>([]);
    const [fruitsVegetable, setFruitsVegetables] = useState<Array<any>>([]);
    const [grains, setGrains] = useState<Array<any>>([]);
    const [herbsSpices, setHerbsSpices] = useState<Array<any>>([]);
    const [protein, setProtein] = useState<Array<any>>([]);
    const [other, setOther] = useState<Array<any>>([]);

    const fetchIngredients = async () => {
        const response = await readIngredientUserProfile(isOwned.toString());
        if (response) {
            setDairy(response.data[0]["dairy"]);
            setFruitsVegetables(response.data[1]["fruitsVegetables"]);
            setGrains(response.data[2]["grains"]);
            setHerbsSpices(response.data[3]["herbsSpices"]);
            setProtein(response.data[4]["protein"]);
            setOther(response.data[5]["other"]);
        }
    };

    useEffect(() => {
        if (!loaded) {
            fetchIngredients().then(() => setLoaded(true));
        }
    }, [loaded]);

    useEffect(() => {
        if (refresh) {
            fetchIngredients().then(() => setRefresh(false));
        }
    }, [refresh]);

    return (
        <div className="flex flex-col p-4 mx-auto rounded-lg bg-dark h-180 w-100">
            <div className="flex flex-row items-center justify-between h-16 p-4 mb-4 text-4xl rounded-t-lg bg-bg">
                <h1>{isOwned ? "Stocked Items" : "Shopping List"}</h1>
                {isOwned ? (
                    <img className="h-1/1 invert" src={checkmark}></img>
                ) : (
                    <img className="h-1/1 invert" src={cart}></img>
                )}
            </div>
            <div className="mb-8 overflow-y-auto grow scrollbar scrollbar-2 max-w-1/1">
                <DropDownMenu
                    ingredientList={dairy}
                    type={"dairy"}
                    name={"Dairy"}
                    suffix={suffix}
                    isOwned={isOwned}
                    setRefresh={setRefresh}
                />
                <DropDownMenu
                    ingredientList={fruitsVegetable}
                    type={"fruitsVegetables"}
                    name={"Fruits & Vegetables"}
                    suffix={suffix}
                    isOwned={isOwned}
                    setRefresh={setRefresh}
                />
                <DropDownMenu
                    ingredientList={grains}
                    type={"grains"}
                    name={"Grains"}
                    suffix={suffix}
                    isOwned={isOwned}
                    setRefresh={setRefresh}
                />
                <DropDownMenu
                    ingredientList={herbsSpices}
                    type={"herbsSpices"}
                    name={"Herbs & Spices"}
                    suffix={suffix}
                    isOwned={isOwned}
                    setRefresh={setRefresh}
                />
                <DropDownMenu
                    ingredientList={protein}
                    type={"protein"}
                    name={"Protein"}
                    suffix={suffix}
                    isOwned={isOwned}
                    setRefresh={setRefresh}
                />
                <DropDownMenu
                    ingredientList={other}
                    type={"other"}
                    name={"Other"}
                    suffix={suffix}
                    isOwned={isOwned}
                    setRefresh={setRefresh}
                />
            </div>
            <ShoppingListForm isOwned={isOwned} setLoaded={setLoaded} />
        </div>
    );
};

export default UserProfileIngredientListCard;
