import { useAuth } from "@/contexts/useAuth";
import FriendsListDisplay from "@/display/FriendsListDisplay";
import RecipeCard from "@/components/RecipeCard";
import RecipeCatalog from "@/components/RecipeCatalog";
import {
    readRecipes,
    readFriendsUserProfile,
    readQueryUserProfile,
    readUserProfile,
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
    const [totalPages] = useState<number | null>(null);

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
        <div className="lg:grid lg:grid-cols-[1fr_2fr_1fr] gap-4 max-w-screen-xl mx-auto mt-4">
            <div className="p-4 rounded-sm max-w-full overflow-hidden bg-blue-400">
                {friendsList.map((friends) => (
                    <FriendsListDisplay
                        friend={friends}
                        handleRemoveFriend={handleRemoveFriend}
                        handleAddFriend={handleAddFriend}
                        addMode={false}
                    />
                ))}
            </div>
            <div className="max-w-full overflow-hidden bg-red-400">
                {" "}
                <form>
                    <input
                        className="w-4/5 p-4 bg-duck-yellow rounded-xl mx-auto text-alt-text"
                        placeholder="Search Username"
                        type="text"
                        onChange={(e) => setUsernameQuery(e.target.value)}
                    />
                    <input
                        className="w-70 py-4 m-4 bg-duck-pale-yellow  rounded-lg font-bol"
                        type="submit"
                        value="Submit"
                        onClick={(e) => searchForUser(e)}
                    />
                </form>
                <div className="flex flex-wrap gap-y-4 justify-evenly  ">
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
            <div className="max-w-full bg-green-400 overflow-hidden">
                {recipes && (
                    <div>
                        <RecipeCatalog
                            recipes={recipes}
                            currentPage={currentPage}
                            hasNext={hasNext}
                            hasPrevious={hasPrevious}
                            traverseMode={false}
                            editMode={false}
                            fetchRecipes={fetchTimeline}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends;
