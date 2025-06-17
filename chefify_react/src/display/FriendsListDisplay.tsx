import { FriendsListDisplayProp } from "@/interfaces/interfaces";
import React from "react";
import RemoveLogo from "@/assets/x.svg?react";
import AddLogo from "@/assets/addFriend.svg?react";

const FriendsListDisplay: React.FC<FriendsListDisplayProp> = ({
    friend,
    handleRemoveFriend,
    handleAddFriend,
    addMode,
}) => {
    return (
        <div
            className="flex items-center gap-2 p-3 mx-auto rounded-md bg-dark w-60 hover:scale-105"
            title={friend.user.username}
        >
            <img
                className="w-16 h-16 bg-blue-500 "
                alt={friend?.user.username ?? "Recipe Image"}
                src={
                    friend?.profilePicture
                        ? `http://localhost:8000${friend?.profilePicture}`
                        : `http://localhost:8000/media/images/recipes/default-recipe.png`
                }
            />
            <div className="flex flex-col  grow min-w-0">
                <h1 className="truncate font-bold">{friend.user.username}</h1>
                <p className="text-sm">
                    {friend.user.first_name}{" "}
                    {friend.user.last_name.length > 0 && "|"}{" "}
                    {friend.user.last_name}
                </p>
            </div>

            <div className="">
                {addMode ? (
                    <AddLogo
                        className="w-5 h-5 hover:text-green-600"
                        onClick={() => handleAddFriend(friend.id)}
                    />
                ) : (
                    <RemoveLogo
                        className="w-5 h-5 hover:text-red-600"
                        onClick={() => handleRemoveFriend(friend.id)}
                    />
                )}
            </div>
        </div>
    );
};

export default FriendsListDisplay;
