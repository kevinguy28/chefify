import { readRecipe } from "@/endpoints/api";
import { Recipe } from "@/interfaces/interfaces";

export const fetchRecipe = async (
    recipeId: string
): Promise<Recipe | false> => {
    const response = await readRecipe(recipeId);
    if (response) {
        return response.data;
    }
    return false;
};
