import { getIngredientUserProfile } from "@/endpoints/api";
import ShoppingListForm from "@/forms/ShoppingListForm";
import { UserProfileIngredientListCardProp } from "@/interfaces/interfaces";
import React, { useState, useEffect } from "react";
import DropDownMenu from "./DropDownMenu";

const UserProfileIngredientListCard: React.FC<
    UserProfileIngredientListCardProp
> = ({ isOwned }) => {
    const [loaded, setLoaded] = useState<boolean>(false);
    const [dairy, setDairy] = useState<Array<any>>([]);
    const [fruitsVegetable, setFruitsVegetables] = useState<Array<any>>([]);
    const [grains, setGrains] = useState<Array<any>>([]);
    const [herbsSpices, setHerbsSpices] = useState<Array<any>>([]);
    const [protein, setProtein] = useState<Array<any>>([]);
    const [other, setOther] = useState<Array<any>>([]);

    const fetchIngredients = async () => {
        const response = await getIngredientUserProfile(isOwned.toString());
        if (response) {
            console.log("hereee");
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

    return (
        <div className="bg-dark h-180 w-100 p-4 flex flex-col">
            <h1 className="text-4xl underline mb-4">
                {isOwned ? "Owned List" : "Shopping List"}
            </h1>
            <div className="grow overflow-y-auto scrollbar scrollbar-2 mb-8">
                <DropDownMenu
                    ingredientList={dairy}
                    type={"dairy"}
                    name={"Dairy"}
                    suffix={"sl"}
                />
                <DropDownMenu
                    ingredientList={fruitsVegetable}
                    type={"fruitsVegetables"}
                    name={"Fruits & Vegetables"}
                    suffix={"sl"}
                />
                <DropDownMenu
                    ingredientList={grains}
                    type={"grains"}
                    name={"Grains"}
                    suffix={"sl"}
                />
                <DropDownMenu
                    ingredientList={herbsSpices}
                    type={"herbsSpices"}
                    name={"Herbs & Spices"}
                    suffix={"sl"}
                />
                <DropDownMenu
                    ingredientList={protein}
                    type={"protein"}
                    name={"Protein"}
                    suffix={"sl"}
                />
                <DropDownMenu
                    ingredientList={other}
                    type={"other"}
                    name={"Other"}
                    suffix={"sl"}
                />
            </div>
            <ShoppingListForm isOwned={false} setLoaded={setLoaded} />
        </div>
    );
};

export default UserProfileIngredientListCard;
