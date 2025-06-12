import React from "react";
import { RecipeQueryProp } from "@/interfaces/interfaces";
import CuisineLogo from "@/assets/cuisine.svg?react";
import SearchLogo from "@/assets/search.svg?react";
import SubmitLogo from "@/assets/submit.svg?react";
import ClearLogo from "@/assets/x.svg?react";
import DescendLogo from "@/assets/descend.svg?react";
import AscendLogo from "@/assets/ascend.svg?react";

const RecipeQuery: React.FC<RecipeQueryProp> = ({
    filterInput,
    setFilterInput,
    setCuisine,
    cuisine,
    recipeCuisine,
    submitSearch,
    fetchRecipes,
    recent,
    setRecent,
}) => {
    const handleClear = () => {
        setFilterInput("");
        fetchRecipes(1);
        setCuisine("");
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-bold">Search</h1>
            <div className="flex items-center gap-2 w-80 p-2 bg-dark rounded-lg">
                <SearchLogo fill="currentColor" className="h-10 w-10" />
                <input
                    className="grow rounded-l-md p-2 outline-none"
                    placeholder="Recipe Name"
                    name="selectRecipeName"
                    type="text"
                    value={filterInput}
                    onChange={(e) => setFilterInput(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 w-80 p-2 bg-dark rounded-lg">
                <CuisineLogo fill="currentColor" className="h-10 w-10" />
                <select
                    className="grow p-2 rounded-lg outline-0 bg-dark"
                    name="selectCuisine"
                    onChange={(e) => setCuisine(e.target.value)}
                    value={cuisine}
                >
                    <option key="N/A">N/A</option>
                    {recipeCuisine.map((theCuisine) => (
                        <option key={theCuisine.id}>{theCuisine.name}</option>
                    ))}
                </select>
            </div>

            <div
                className="group relative w-80 h-14 overflow-hidden bg-dark cursor-pointer rounded-lg"
                onClick={() => setRecent(!recent)}
            >
                <div
                    className={`h-28 transition-transform duration-700 ease-in-out ${
                        recent ? "" : "translate-y-[-50%]"
                    }`}
                >
                    <div className=" h-14 flex gap-2 p-2">
                        <DescendLogo className="w-10 h-10" />
                        <h1 className="p-2">Recent</h1>
                    </div>
                    <div className=" h-14 flex gap-2 p-2">
                        <AscendLogo className="w-10 h-10" />
                        <h1 className="p-2">Oldest</h1>
                    </div>
                </div>
            </div>

            <div
                className="group relative w-80 overflow-hidden bg-blue-950 cursor-pointer rounded-lg"
                onClick={(e) => submitSearch(e)}
            >
                <div className="flex w-160 transition-transform duration-700 ease-in-out group-hover:translate-x-[-50%] rounded-lg">
                    <div className="p-2 w-80  bg-dark text-white">
                        <div className="flex justify-between items-center">
                            <SubmitLogo
                                fill="currentColor"
                                className="h-10 w-10 text-white transition-transform duration-700 ease-in-out  group-hover:translate-x-146 "
                            />
                            <div className="group-hover:opacity-0 group-hover:-translate-x-[-20px] duration-400 ease-in-out ">
                                Search
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center p-2 w-80 bg-green-600 text-white group">
                        <div className="opacity-0 translate-x-5 group-hover:opacity-100 group-hover:translate-x-[-5] transition-all duration-500 ease-in-out font-bold ">
                            Send
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="group relative w-80 overflow-hidden bg-blue-950 cursor-pointer rounded-lg"
                onClick={handleClear}
            >
                <div className="flex w-160 transition-transform duration-700 ease-in-out group-hover:translate-x-[-50%] rounded-lg">
                    <div className="p-2 w-80  bg-dark text-white">
                        <div className="flex justify-between items-center">
                            <ClearLogo
                                fill="currentColor"
                                className="h-10 w-10 text-white transition-transform duration-700 ease-in-out  group-hover:translate-x-146 "
                            />
                            <div className="group-hover:opacity-0 group-hover:-translate-x-[-20px] duration-400 ease-in-out ">
                                Clear
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center p-2 w-80 bg-red-400 text-white group">
                        <div className="opacity-0 translate-x-5 group-hover:opacity-100 group-hover:translate-x-[-5] transition-all duration-500 ease-in-out font-bold">
                            Clear
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeQuery;
