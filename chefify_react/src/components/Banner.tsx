import { useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { logout } from "@/endpoints/api";
import BurgerMenu from "@/assets/burger_menu.svg?react";
import { useAuth } from "@/contexts/useAuth";

const Banner = () => {
    // const nav = useNavigate();

    const { logout_user } = useAuth();

    const [activated, setActivated] = useState<boolean>(false);

    const handleLogout = async () => {
        // const success = await logout();

        // if (success) {
        //     nav("/login");
        // }
        await logout_user();
    };

    const toggleMenu = () => {
        if (activated === true) {
            const navItems = document.getElementsByClassName("navBarItem");
            const nav = document.getElementById("navBar");
            nav?.classList.remove("block");
            nav?.classList.add("flex");

            for (const item of navItems) {
                item.classList.remove("hamburger");
            }

            const logoutItem = document.getElementById("test");
            logoutItem?.classList.remove("block");
            logoutItem?.classList.add("hidden");
        } else {
            const navItems = document.getElementsByClassName("navBarItem");
            const nav = document.getElementById("navBar");
            nav?.classList.remove("flex");
            nav?.classList.add("block");

            for (const item of navItems) {
                item.classList.add("hamburger");
            }

            const logoutItem = document.getElementById("test");
            logoutItem?.classList.add("block");
            logoutItem?.classList.remove("hidden");
        }
        setActivated(!activated);
    };

    return (
        <div className="sticky top-0 z-50 text-alt-text">
            <div
                className="relative overflow-hidden bg-duck-yellow sm:static "
                id="navBar"
            >
                <Link
                    className="block float-left px-2 py-4 font-bold navBarItem bg-duck-orange hover:bg-duck-pale-yellow"
                    to={`/`}
                >
                    Chefify
                </Link>
                <Link
                    className="hidden px-2 py-4 default navBarItem hover:bg-duck-pale-yellow"
                    to={"/recipe/edit-catalog/"}
                >
                    Recipes
                </Link>
                <Link
                    className="hidden px-2 py-4 default navBarItem hover:bg-duck-pale-yellow"
                    to={"/shopping-list/"}
                >
                    Shopping List
                </Link>
                <Link
                    className="hidden px-2 py-4 default navBarItem hover:bg-duck-pale-yellow"
                    to={"/favourites/"}
                >
                    Favourites
                </Link>
                <Link
                    className="hidden px-2 py-4 default navBarItem hover:bg-duck-pale-yellow"
                    to={"/friends/"}
                >
                    Friends
                </Link>
                <Link
                    className="hidden px-2 py-4 default navBarItem hover:bg-duck-pale-yellow"
                    to={"/profile/"}
                >
                    Profile
                </Link>
                <div
                    className={`px-2 py-4 ${
                        activated ? "sm:hidden block" : "hidden"
                    } hover:bg-duck-pale-yellow`}
                    onClick={handleLogout}
                    id="test"
                >
                    Logout
                </div>{" "}
                <div
                    className="absolute hidden cursor-pointer right-2 top-4 sm:block logoutItem"
                    onClick={handleLogout}
                    id="logoutItem"
                >
                    Logout
                </div>
                <BurgerMenu
                    className="absolute right-0 w-10 h-10 ml-auto sm:hidden top-2"
                    onClick={toggleMenu}
                />
            </div>
        </div>
    );
};
export default Banner;
