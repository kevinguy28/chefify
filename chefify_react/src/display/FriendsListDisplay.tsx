import {
    updateAddFriendUserProfile,
    updateRemoveFriendUserProfile,
} from "@/endpoints/api";
import { FriendsListDisplayProp } from "@/interfaces/interfaces";
import React from "react";
import removeIcon from "@/assets/x.png";

const FriendsListDisplay: React.FC<FriendsListDisplayProp> = ({
    friend,
    handleRemoveFriend,
    handleAddFriend,
    addMode,
}) => {
    return (
        <div
            className="group relative w-full min-h-18 mb-4 max-w-70"
            title={friend.user.username}
        >
            <div className="relative mb-4 p-2 z-1 w-[80%] h-full flex flex-row gap-2 justify-center items-center rounded-md bg-red-500   transition-all duration-300 ease-in-out ">
                <img
                    className="w-16 h-16  bg-blue-500 rounded-md"
                    alt={friend?.user.username ?? "Recipe Image"}
                    src={
                        friend?.profilePicture
                            ? `http://localhost:8000${friend?.profilePicture}`
                            : `http://localhost:8000/media/images/recipes/default-recipe.png`
                    }
                />
                <div className="flex flex-col grow min-w-0 justify-center ">
                    <div className="text-xl truncate overflow-hidden whitespace-nowrap">
                        {friend.user.username}
                    </div>
                    <div className="text-sm  truncate overflow-hidden whitespace-nowrap">
                        {friend.user.first_name} {friend.user.last_name}
                    </div>{" "}
                </div>
            </div>
            <div className="absolute top-0 left-0 w-[80%] group-hover:w-full h-full flex  rounded-md  transition-all duration-500 ease-in-out bg-duck-yellow">
                <div className=" mx-2 grow flex justify-end items-center opacity-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out ">
                    {addMode ? (
                        <svg
                            fill="currentColor"
                            className="w-8 h-8 text-black hover:text-duck-orange"
                            viewBox="0 0 32 32"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => handleAddFriend(friend.id)}
                        >
                            <path d="M2.016 28q0 0.832 0.576 1.44t1.408 0.576h14.016v-0.352q-1.792-0.608-2.912-2.176t-1.088-3.488q0-2.016 1.184-3.584t3.072-2.112q0.384-1.216 1.216-2.176t2.016-1.504q0.512-1.376 0.512-2.624v-1.984q0-3.328-2.368-5.664t-5.632-2.336-5.664 2.336-2.336 5.664v1.984q0 2.112 1.024 3.904t2.784 2.912q-1.504 0.544-2.912 1.504t-2.496 2.144-1.76 2.624-0.64 2.912zM18.016 24q0 0.832 0.576 1.44t1.408 0.576h2.016v1.984q0 0.864 0.576 1.44t1.408 0.576 1.408-0.576 0.608-1.44v-1.984h1.984q0.832 0 1.408-0.576t0.608-1.44-0.608-1.408-1.408-0.576h-1.984v-2.016q0-0.832-0.608-1.408t-1.408-0.576-1.408 0.576-0.576 1.408v2.016h-2.016q-0.832 0-1.408 0.576t-0.576 1.408z"></path>
                        </svg>
                    ) : (
                        <svg
                            fill="currentColor"
                            className="w-8 h-8 text-black hover:text-duck-orange"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 460.775 460.775"
                            onClick={() => handleRemoveFriend(friend.id)}
                        >
                            <path
                                d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                            />
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendsListDisplay;
