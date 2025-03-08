import axios, { AxiosResponse } from "axios";
const BASE_URL = "http://127.0.0.1:8000/api/";
const CREATE_URL = "create/";
const READ_URL = "read/";
const UPDATE_URL = "update/";
const DELETE_URL = "delete/";
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;

// Cuisine

const CUISINE_URL = `${BASE_URL}cuisine/`;
const CUISINE_READ_URL = `${CUISINE_URL}${READ_URL}`;
// Recipes
const RECIPES_URL = `${BASE_URL}recipes/`;
const RECIPES_READ_URL = `${RECIPES_URL}${READ_URL}`;

// Recipe
const RECIPE_URL = `${BASE_URL}recipe/`;
const RECIPE_CREATE_URL = `${RECIPE_URL}${CREATE_URL}`;
const RECIPE_READ_URL = `${RECIPE_URL}${READ_URL}`;
const RECIPE_UPDATE_URL = `${RECIPE_URL}${UPDATE_URL}`;

// Recipe Step
const RECIPE_STEP_URL = `${BASE_URL}step/recipe/`;
const RECIPE_STEP_CREATE_URL = `${RECIPE_STEP_URL}${CREATE_URL}`;
const RECIPE_STEP_DELETE_URL = `${RECIPE_STEP_URL}${DELETE_URL}`;

// Recipe Steps

const RECIPE_STEPS_URL = `${BASE_URL}steps/recipe/`;
const RECIPE_STEPS_READ_URL = `${RECIPE_STEPS_URL}${READ_URL}`;

const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register/`;

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

export const readRecipes = async () => {
    try {
        const response = await axios.get(RECIPES_READ_URL, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(RECIPES_READ_URL, { withCredentials: true })
        );
    }
};

// Recipe

export const readRecipe = async (recipeId: string) => {
    const url = `${RECIPE_READ_URL}${recipeId}/`;
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

export const updateRecipe = async (
    recipeId: number,
    recipeName: string,
    recipeCuisine: string,
    recipePrivacy: string,
    recipeDescription: string,
    recipeImage: File | null
) => {
    const url = `${RECIPE_UPDATE_URL}${recipeId}/`;
    const formData = new FormData();

    formData.append("recipeName", recipeName);
    formData.append("recipeCuisine", recipeCuisine); // Convert to string
    formData.append("recipePrivacy", recipePrivacy);
    formData.append("recipeDescription", recipeDescription);

    if (recipeImage) {
        formData.append("recipeImage", recipeImage);
    }

    try {
        const response = await axios.put(url, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.put(url, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            })
        );
    }
};

// Recipe Step

export const createRecipeStep = async (
    recipeId: string,
    stepTitle: string,
    stepDescription: string
) => {
    const url = `${RECIPE_STEP_CREATE_URL}${recipeId}/`;
    try {
        const response = await axios.post(
            url,
            {
                stepTitle,
                stepDescription,
            },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.post(
                url,
                {
                    stepTitle,
                    stepDescription,
                },
                { withCredentials: true }
            )
        );
    }
};

export const deleteRecipeStep = async (stepId: string) => {
    const url = `${RECIPE_STEP_DELETE_URL}${stepId}/`;
    try {
        const response = await axios.delete(url, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.delete(url, { withCredentials: true })
        );
    }
};

// Recipe Steps

export const readRecipeSteps = async (recipeId: string) => {
    const url = `${RECIPE_STEPS_READ_URL}${recipeId}/`;
    try {
        const response = await axios.get(url, { withCredentials: true });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(url, { withCredentials: true })
        );
    }
};
// Cuisines

export const readCuisines = async () => {
    try {
        const response = await axios.get(CUISINE_READ_URL, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(CUISINE_READ_URL, { withCredentials: true })
        );
    }
};
