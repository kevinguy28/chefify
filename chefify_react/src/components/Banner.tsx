import React from "react";
import "../index.css";
import chefifyDuck from "../assets/chefify-duck.gif";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "@/endpoints/api";

const Banner = () => {
    const nav = useNavigate();

    const handleLogout = async () => {
        const success = await logout();

        if (success) {
            nav("/login");
        }
    };

    return (
        <div className="sticky top-0 z-50 text-alt-text">
            <div className="flex items-center gap-4 bg-duck-yellow p-3">
                <div className="text-duck-dark-orange font-bold">Chefify</div>
                <Link to={`/`}>Home</Link>
                <Link to={"/recipe/edit-catalog/"}>Recipes</Link>
                <Link to={"/shopping-list/"}>Shopping List</Link>
                <Link to={"/favourites/"}>Favourites</Link>
                <Link to={"/friends/"}>Friends</Link>
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
