import { useAuth } from "@/contexts/useAuth";
import FriendsListDisplay from "@/display/FriendsListDisplay";
import RecipeCatalog from "@/components/RecipeCatalog";
import {
    readFriendsUserProfile,
    readQueryUserProfile,
    updateAddFriendUserProfile,
    updateRemoveFriendUserProfile,
    readTimeline,
} from "@/endpoints/api";
import { UserProfile, Recipe } from "@/interfaces/interfaces";
import React, { useState, useEffect } from "react";

const Friends = () => {
    const { userProfile } = useAuth();

    const [friendsList, setFriendsList] = useState<Array<UserProfile>>([]);
    const [queryProfile, setQueryProfile] = useState<Array<UserProfile>>([]);
    const [usernameQuery, setUsernameQuery] = useState<string>("");

    const [recipes, setRecipes] = useState<Array<Recipe>>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNext, setHasNext] = useState<boolean>(false);
    const [hasPrevious, setHasPrevious] = useState<boolean>(false);

    const fetchFriendsProfiles = async () => {
        const response = await readFriendsUserProfile();
        if (response) {
            setFriendsList(response);
        }
    };

    const searchForUser = async (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>
    ) => {
        e.preventDefault();
        const response = await readQueryUserProfile(usernameQuery);
        if (response) {
            setQueryProfile(response);
        }
    };

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

    const handleAddFriend = async (userProfileId: number) => {
        const response = await updateAddFriendUserProfile(
            userProfileId.toString(),
            "add"
        );
        if (response) {
            setQueryProfile(
                queryProfile.filter(
                    (friendAdd) => friendAdd.id !== userProfileId
                )
            );
            console.log(response);
        }
    };

    const fetchTimeline = async (currentPage: number) => {
        const response = await readTimeline(
            currentPage,
            false,
            "friends",
            undefined,
            undefined
        );
        if (response) {
            setRecipes(response.recipes);
            setCurrentPage(response.page);
            setHasNext(response.hasNext);
            setHasPrevious(response.hasPrevious);
            setRecipes(response.recipes);
        }
    };

    useEffect(() => {
        if (userProfile) {
            fetchFriendsProfiles();
        }
    }, [queryProfile]);

    useEffect(() => {
        fetchTimeline(1);
    }, []);

    return (
        <div className="lg:grid lg:grid-cols-[1fr_2fr_2fr] gap-4 max-w-screen-2xl mx-auto mt-4 ">
            <div className="flex items-baseline gap-4 p-4  sm:flex-wrap lg:flex-col">
                <h1 className="font-bold text-lg">Your Friends</h1>
                {friendsList.length > 0 ? (
                    friendsList.map((friends) => (
                        <FriendsListDisplay
                            friend={friends}
                            handleRemoveFriend={handleRemoveFriend}
                            handleAddFriend={handleAddFriend}
                            addMode={false}
                        />
                    ))
                ) : (
                    <div>You currently have nobody on your friends list!</div>
                )}
            </div>
            <div className="max-w-full overflow-hidden  p-4">
                {" "}
                <h1 className="font-bold text-lg">Search Users</h1>
                <div className="p-3 flex flex-col gap-4">
                    <form className="flex flex-col gap-4">
                        <input
                            className="p-4 mx-auto bg-dark rounded-md w-full "
                            placeholder="Search Username"
                            type="text"
                            onChange={(e) => setUsernameQuery(e.target.value)}
                        />
                        <input
                            className="p-4  rounded-md w-70  font-bold bg-green-600"
                            type="submit"
                            value="Submit"
                            onClick={(e) => searchForUser(e)}
                        />
                    </form>
                    <div className="flex flex-wrap gap-y-4 justify-evenly ">
                        {queryProfile.map((profile) => (
                            <FriendsListDisplay
                                friend={profile}
                                handleRemoveFriend={handleRemoveFriend}
                                handleAddFriend={handleAddFriend}
                                addMode={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="max-w-full overflow-hidden p-4 ">
                <div className="font-bold mb-4">Friend Recipes</div>
                {recipes.length > 0 ? (
                    <RecipeCatalog
                        recipes={recipes}
                        currentPage={currentPage}
                        hasNext={hasNext}
                        hasPrevious={hasPrevious}
                        traverseMode={false}
                        editMode={false}
                        fetchRecipes={fetchTimeline}
                    />
                ) : (
                    <div>There are currently no recipes to show!</div>
                )}
            </div>
        </div>
    );
};

export default Friends;
