import React, { useState, useEffect } from "react";
import { DropDownMenuProp, Ingredient } from "@/interfaces/interfaces";
import dropDownSVG from "@/assets/dropdown.svg";
import alignJustify from "@/assets/align-justify.svg";
import { deleteIngredientUserProfile } from "@/endpoints/api";

const DropDownMenu: React.FC<DropDownMenuProp> = ({
    ingredientList,
    type,
    name,
    suffix,
}) => {
    const bgColor = {
        dairy: "bg-blue-dairy",
        fruitsVegetables: "bg-green-fruitsVegetable",
        grains: "bg-yellow-grains",
        herbsSpices: "bg-orange-herbsSpices",
        protein: "bg-red-protein",
        other: "bg-purple-other",
    } as const;

    const bgColorSelect = (type: keyof typeof bgColor) => {
        return bgColor[type];
    };

    const [open, setOpen] = useState<boolean>(false);
    const [list, setList] = useState<Array<Ingredient>>(ingredientList);

    const openMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        setOpen((prev) => !prev);
        const elements = Array.from(
            document.querySelectorAll(`.${type}-${suffix}`)
        );
        const delBtns = Array.from(
            document.querySelectorAll(`.${type}-${suffix}-del`)
        );
        const svgIconDrop = document.getElementsByClassName(
            `${type}-${suffix}-dropdown`
        )[0];
        const svgIconJustify = document.getElementsByClassName(
            `${type}-${suffix}-alignJustify`
        )[0];

        if (open) {
            elements.forEach((element) => {
                element.classList.add("hidden");
            });
            delBtns.forEach((element) => {
                element.classList.add("hidden");
            });
            svgIconJustify.classList.remove("hidden");
            svgIconDrop.classList.add("hidden");
        } else {
            elements.forEach((element) => {
                element.classList.remove("hidden");
            });
            delBtns.forEach((element) => {
                element.classList.remove("hidden");
            });
            svgIconJustify.classList.add("hidden");
            svgIconDrop.classList.remove("hidden");
        }
    };

    const handleDelete = async (id: number) => {
        const response = await deleteIngredientUserProfile("false", id);
        if (response) {
            setList((prevList) => prevList.filter((item) => item.id !== id));
        }
    };

    useEffect(() => {
        setList(ingredientList);
    }, [ingredientList]);

    return (
        <div className={`${bgColorSelect(type)} `}>
            <div className="flex justify-between p-4 h-14">
                <div className="font-bold">{name}</div>
                <img
                    src={alignJustify}
                    className={`${`${type}-${suffix}-alignJustify`}`}
                    alt="Align Justify"
                    onClick={(e) => openMenu(e)}
                />
                <img
                    src={dropDownSVG}
                    className={`${`${type}-${suffix}-dropdown`} hidden`}
                    alt="Drop Down Icon"
                    onClick={(e) => openMenu(e)}
                />
            </div>
            {list.map((ingredient, index) => (
                <div
                    className={`${
                        index === 0 ? "pb-2" : "py-2"
                    } px-4 ${`${type}-${suffix}`} hidden flex justify-between`}
                >
                    <div key={index}>{ingredient.name}</div>
                    <div
                        onClick={() => handleDelete(ingredient?.id)}
                        className={`${`${type}-${suffix}-del`} hidden`}
                    >
                        Del
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DropDownMenu;
