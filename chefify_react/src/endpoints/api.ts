import axios, { AxiosResponse } from "axios";
const BASE_URL = "http://127.0.0.1:8000/api/";
const CREATE_URL = "create/";
const EDIT_URL = "edit/";
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;

// Cuisine

const CUISINE_URL = `${BASE_URL}cuisine/`;

// Recipes
const RECIPES_URL = `${BASE_URL}recipes/`;

// Recipe
const RECIPE_URL = `${BASE_URL}recipe/`;
const RECIPE_CREATE_URL = `${RECIPE_URL}${CREATE_URL}`;
const RECIPE_EDIT_URL = `${RECIPE_URL}${EDIT_URL}`;

const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register/`;

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(
            LOGIN_URL,
            { username, password },
            { withCredentials: true }
        );

        return response.data.success;
    } catch (error) {
        console.error("Login error:", error);
        return false; // Handle failure gracefully
    }
};

export const logout = async () => {
    try {
        await axios.post(LOGOUT_URL, {}, { withCredentials: true });
        return true;
    } catch (error) {
        return false;
    }
};

export const register = async (
    username: string,
    email: string,
    password: string
) => {
    try {
        const response = await axios.post(
            REGISTER_URL,
            { username, email, password },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error; // Optionally rethrow the error to handle it later
    }
};

export const is_authenticated = async () => {
    try {
        await axios.post(AUTHENTICATED_URL, {}, { withCredentials: true });
        return true;
    } catch (erorr) {
        return false;
    }
};

export const refresh_token = async () => {
    try {
        await axios.post(REFRESH_URL, {}, { withCredentials: true });
        return true;
    } catch (error) {
        return false;
    }
};

// Recipes

export const getRecipes = async () => {
    try {
        const response = await axios.get(RECIPES_URL, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(RECIPES_URL, { withCredentials: true })
        );
    }
};

// Recipe

export const getRecipe = async (recipeId: string) => {
    const url = `${RECIPE_URL}${recipeId}/`;
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(url, { withCredentials: true })
        );
    }
};

export const createRecipe = async (recipeName: string, cuisine: string) => {
    try {
        const reponse = await axios.post(
            RECIPE_CREATE_URL,
            {
                recipeName,
                cuisine,
            },
            { withCredentials: true }
        );
        return reponse.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.post(
                RECIPE_CREATE_URL,
                {
                    recipeName,
                    cuisine,
                },
                { withCredentials: true }
            )
        );
    }
};

export const editRecipe = async (
    recipeId: number,
    recipeName: string,
    recipeCuisine: string,
    recipePrivacy: string,
    recipeDescription: string,
    recipeImageUrl: string,
    recipeImage: File
) => {
    const url = `${RECIPE_EDIT_URL}${recipeId}/`;
    try {
        const response = await axios.put(
            url,
            {
                recipeName,
                recipeCuisine,
                recipePrivacy,
                recipeDescription,
                recipeImageUrl,
                recipeImage,
            },
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.put(
                url,
                {
                    recipeName,
                    recipeCuisine,
                    recipePrivacy,
                    recipeDescription,
                    recipeImageUrl,
                    recipeImage,
                },
                {
                    withCredentials: true,
                }
            )
        );
    }
};
// Cuisines

export const getCuisines = async () => {
    try {
        const response = await axios.get(CUISINE_URL, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(CUISINE_URL, { withCredentials: true })
        );
    }
};

export const call_refresh = async (error: any, func: () => Promise<any>) => {
    if (error.response && error.response.status === 401) {
        const tokenRefreshed = await refresh_token();
        if (tokenRefreshed) {
            const retryResponse = await func();
            return retryResponse.data;
        }
    }
    return false;
};
