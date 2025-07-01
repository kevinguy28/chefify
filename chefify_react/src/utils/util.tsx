import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/firebase/firebase";

export const uploadUserImage = async (
    file: File,
    userId: string,
    recipeId: string
): Promise<string> => {
    const folderRef = ref(storage, `user_images/${userId}/${recipeId}/`);

    // ✅ Step 1: Delete all existing images in the recipe folder
    try {
        const existingFiles = await listAll(folderRef);
        const deletePromises = existingFiles.items.map((itemRef) =>
            deleteObject(itemRef)
        );
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error deleting existing images:", error);
        // Optionally, alert or handle this depending on how critical it is
    }

    // ✅ Step 2: Upload the new image
    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const storageRef = ref(
        storage,
        `user_images/${userId}/${recipeId}/${uniqueFilename}`
    );

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
};
