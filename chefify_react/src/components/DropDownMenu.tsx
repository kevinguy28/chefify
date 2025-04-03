import React, { useState, useEffect } from "react";
import { DropDownMenuProp, Ingredient } from "@/interfaces/interfaces";
import {
    deleteIngredientUserProfile,
    moveIngredientsUserProfile,
} from "@/endpoints/api";

import dropDownSVG from "@/assets/dropdown.svg";
import alignJustify from "@/assets/align-justify.svg";

const DropDownMenu: React.FC<DropDownMenuProp> = ({
    ingredientList,
    type,
    name,
    suffix,
    isOwned,
    setRefresh,
}) => {
    const bgColor = {
        dairy: "bg-blue-dairy",
        fruitsVegetables: "bg-green-fruitsVegetables",
        grains: "bg-yellow-grains",
        herbsSpices: "bg-orange-herbsSpices",
        protein: "bg-red-protein",
        other: "bg-purple-other",
    } as const;

    const bgColorSelect = (type: keyof typeof bgColor) => {
        return bgColor[type];
    };

    const bgColorSelectLight = (type: keyof typeof bgColor) => {
        return `${bgColor[type]}-light`;
    };

    const [open, setOpen] = useState<boolean>(false);
    const [list, setList] = useState<Array<Ingredient>>(ingredientList);

    const openMenu = () => {
        setOpen((prev) => !prev);
        const elements = Array.from(
            document.querySelectorAll(`.${type}-${suffix}`)
        );
        const delBtns = Array.from(
            document.querySelectorAll(`.${type}-${suffix}-del`)
        );
        const moveBtns = Array.from(
            document.querySelectorAll(`.${type}-${suffix}-move`)
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
                element.classList.remove(bgColorSelectLight(type));
            });
            moveBtns.forEach((element) => {
                element.classList.add("hidden");
                element.classList.remove(bgColorSelectLight(type));
            });
            svgIconJustify.classList.remove("hidden");
            svgIconDrop.classList.add("hidden");
        } else {
            elements.forEach((element) => {
                element.classList.remove("hidden");
            });
            delBtns.forEach((element) => {
                element.classList.remove("hidden");
                element.classList.add(bgColorSelectLight(type));
            });
            moveBtns.forEach((element) => {
                element.classList.remove("hidden");
                element.classList.add(bgColorSelectLight(type));
            });
            svgIconJustify.classList.add("hidden");
            svgIconDrop.classList.remove("hidden");
        }
    };

    const handleMove = async (id: number) => {
        const response = await moveIngredientsUserProfile(
            isOwned.toString(),
            id
        );
        if (response) {
            setRefresh(true);
        }
    };

    const handleDelete = async (id: number) => {
        const response = await deleteIngredientUserProfile(
            isOwned.toString(),
            id
        );
        if (response) {
            setList((prevList) => prevList.filter((item) => item.id !== id));
        }
    };

    useEffect(() => {
        setList(ingredientList);
    }, [ingredientList]);

    useEffect(() => {
        if (open) {
            const elements = Array.from(
                document.querySelectorAll(`.${type}-${suffix}`)
            );
            const delBtns = Array.from(
                document.querySelectorAll(`.${type}-${suffix}-del`)
            );
            const moveBtns = Array.from(
                document.querySelectorAll(`.${type}-${suffix}-move`)
            );
            elements.forEach((element) => {
                element.classList.remove("hidden");
            });
            delBtns.forEach((element) => {
                element.classList.remove("hidden");
                element.classList.add(bgColorSelectLight(type));
            });
            moveBtns.forEach((element) => {
                element.classList.remove("hidden");
                element.classList.add(bgColorSelectLight(type));
            });
        }
    }, [list]);

    return (
        <div className={`${bgColorSelect(type)} `}>
            <div className="flex justify-between p-4 h-14">
                <div className="font-bold">{name}</div>
                <img
                    src={alignJustify}
                    className={`${`${type}-${suffix}-alignJustify`}`}
                    alt="Align Justify"
                    onClick={openMenu}
                />
                <img
                    src={dropDownSVG}
                    className={`${`${type}-${suffix}-dropdown`} hidden`}
                    alt="Drop Down Icon"
                    onClick={openMenu}
                />
            </div>
            {list.length === 0 ? (
                <div
                    className={`py-2 px-4 ${`${type}-${suffix}`} hidden flex justify-between`}
                >
                    There are currently no items in {name}!
                </div>
            ) : (
                <>
                    {" "}
                    {list.map((ingredient, index) => (
                        <div
                            className={`${
                                index === 0 ? "pb-2" : "py-2"
                            } px-4 ${`${type}-${suffix}`} hidden flex justify-between items-start`}
                            key={index}
                        >
                            <div
                                key={index}
                                className="w-3/5 break-words p-1 flex-shrink-0"
                            >
                                {ingredient.name}
                            </div>
                            <div
                                onClick={() => handleMove(ingredient?.id)}
                                className={`${`${type}-${suffix}-move`} hidden py-1 px-2 flex-shrink-0 hover:bg-bg`}
                            >
                                Move
                            </div>
                            <div
                                onClick={() => handleDelete(ingredient?.id)}
                                className={`${`${type}-${suffix}-del`} hidden py-1 px-2 flex-shrink-0 hover:bg-bg`}
                            >
                                Del
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default DropDownMenu;
