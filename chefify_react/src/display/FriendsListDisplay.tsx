import { updateRemoveFriendUserProfile } from "@/endpoints/api";
import { FriendsListDisplayProp } from "@/interfaces/interfaces";
import React from "react";

const FriendsListDisplay: React.FC<FriendsListDisplayProp> = ({
    friend,
    friendsList,
    setFriendsList,
}) => {
    const handleRemoveFriend = async (userProfileId: number) => {
        const response = await updateRemoveFriendUserProfile(
            userProfileId.toString(),
            "remove"
        );
        if (response) {
            setFriendsList(
                friendsList.filter(
                    (friendRemove) => friendRemove.id !== userProfileId
                )
            );
            console.log(response);
        }
    };
    return (
        <div className="flex flex-row gap-1 items-center bg-red-300">
            <img
                className="w-16 h-16  bg-blue-500"
                alt={friend?.user.username ?? "Recipe Image"}
                src={
                    friend?.profilePicture
                        ? `http://localhost:8000${friend?.profilePicture}`
                        : `http://localhost:8000/media/images/recipes/default-recipe.png`
                }
            />
            <div className="flex flex-col">
                <div className="text-2xl">{friend.user.username}</div>
                <div className="text-sm">
                    {friend.user.first_name} {friend.user.last_name}
                </div>{" "}
            </div>
            <div
                className="text-sm ml-auto cursor-pointer text-red-700 hover:underline"
                onClick={() => handleRemoveFriend(friend.id)}
            >
                Remove
            </div>
        </div>
    );
};

export default FriendsListDisplay;
