import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/useAuth";
import { putUserName } from "@/endpoints/api";

const Profile = () => {
    const { user } = useAuth();
    const [firstName, setFirstName] = useState<string>(user?.first_name ?? "");

    const [lastName, setLastName] = useState<string>(user?.last_name ?? "");

    const [username, setUsername] = useState<string>(user?.username ?? "");

    const submitChanges = async () => {
        const response = await putUserName(firstName, lastName, username);
        if (response) {
            alert("Changes have been saved!");
        }
    };

    useEffect(() => {
        console.log("👤 User in Profile:", user);
    }, [user]);

    return (
        <div className="flex flex-col gap-4 sm:flex-col p-4 mx-auto max-w-90 justify-center rounded-md  ">
            <label htmlFor="selectRecipeName" className="font-bold">
                First Name:
            </label>
            <input
                className="p-2 rounded-lg w-80 h-14 bg-dark"
                placeholder="Name of Recipe"
                name="selectRecipeName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <label htmlFor="selectRecipeName" className="font-bold">
                Last Name:
            </label>
            <input
                className="p-2 rounded-lg w-80 h-14 bg-dark"
                placeholder="Name of Recipe"
                name="selectRecipeName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />{" "}
            <label htmlFor="selectRecipeName" className="font-bold">
                Username:
            </label>
            <input
                className="p-2 rounded-lg w-80 h-14 bg-dark"
                placeholder="Name of Recipe"
                name="selectRecipeName"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <label className="font-bold">Email:</label>
            <div>{user?.email}</div>
            <div
                onClick={submitChanges}
                className="py-2 bg-green-600 rounded-lg w-80 h-14 hover:bg-green-700 flex justify-center items-center font-bold"
            >
                Save{" "}
            </div>
        </div>
    );
};

export default Profile;
