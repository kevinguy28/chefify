import UserProfileIngredientListCard from "@/components/UserProfileIngredientListCard";
import React, { useState, useEffect } from "react";

const Shoppinglist = () => {
    const [refresh, setRefresh] = useState<boolean>(false);

    return (
        <div className="flex justify-center gap-4 p-4">
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
