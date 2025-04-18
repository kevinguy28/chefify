import { useAuth } from "@/contexts/useAuth";
import FriendsListDisplay from "@/display/FriendsListDisplay";
import {
    readFriendsUserProfile,
    readQueryUserProfile,
    readUserProfile,
    updateRemoveFriendUserProfile,
} from "@/endpoints/api";
import { UserProfile } from "@/interfaces/interfaces";
import React, { useState, useEffect } from "react";

const Friends = () => {
    const { userProfile } = useAuth();

    const [friendsList, setFriendsList] = useState<Array<UserProfile>>([]);
    const [usernameQuery, setUsernameQuery] = useState<string>("");

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
            console.log(response);
        }
    };

    useEffect(() => {
        if (userProfile) {
            fetchFriendsProfiles();
        }
    }, []);

    return (
        <div className="lg:grid lg:grid-cols-[1fr_2fr_1fr] max-w-screen-xl mx-auto bg-blue-950 mt-4">
            <div>
                <h1>Friends List</h1>
                {friendsList.map((friends) => (
                    <FriendsListDisplay
                        friend={friends}
                        friendsList={friendsList}
                        setFriendsList={setFriendsList}
                    />
                ))}
            </div>
            <div>
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
            </div>
            <div></div>
        </div>
    );
};

export default Friends;
