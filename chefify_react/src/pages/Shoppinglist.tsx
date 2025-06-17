import UserProfileIngredientListCard from "@/components/UserProfileIngredientListCard";
import { useState } from "react";

const Shoppinglist = () => {
    const [refresh, setRefresh] = useState<boolean>(false);

    return (
        <div className="flex items-center justify-center w-full gap-8 p-4 mx-auto  sm:flex-col lg:flex-row lg:max-w-230 h-[calc(100vh-48px)]">
            <UserProfileIngredientListCard
                isOwned={true}
                suffix={"own"}
                setRefresh={setRefresh}
                refresh={refresh}
            />
            <UserProfileIngredientListCard
                isOwned={false}
                suffix={"sl"}
                setRefresh={setRefresh}
                refresh={refresh}
            />
        </div>
    );
};

export default Shoppinglist;
