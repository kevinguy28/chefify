import React from "react";
import "../index.css";
import chefifyDuck from "../assets/chefify-duck.gif";
import { useNavigate } from "react-router-dom";
import { logout } from "@/endpoints/api";

const Banner = () => {
    const nav = useNavigate();

    const handleLogout = async () => {
        console.log("hello");
        const success = await logout();

        if (success) {
            nav("/login");
        }
    };

    return (
        <div className="">
            <div className="flex items-center gap-4 bg-duck-yellow p-3">
                <div className="text-duck-dark-orange font-bold">Chefify</div>
                <div>Home</div>
                <div>Recipes</div>{" "}
                <div onClick={handleLogout} className="ml-auto">
                    Logout
                </div>
            </div>
            {/* <img
                className="w-75 h-75 absolute top-0 right-0"
                src={chefifyDuck}
                alt="Chefify Duck GIF"
            /> */}
        </div>
    );
};
export default Banner;
