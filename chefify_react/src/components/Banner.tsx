import React from "react";
import "../index.css";
import chefifyDuck from "../assets/chefify-duck.gif";

const Banner = () => {
    return (
        <div className="">
            <div className="flex items-center gap-4 bg-duck-yellow">
                <div className="text-duck-dark-orange bg-red-200">Chefify</div>
                <div>Home</div>
                <div>Recipes</div>
            </div>
            <img
                className="w-75 h-75 absolute top-0 right-0"
                src={chefifyDuck}
                alt="Chefify Duck GIF"
            />
            <div className="bg-blue-400">g</div>
        </div>
    );
};
export default Banner;
