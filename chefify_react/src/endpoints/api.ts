import axios from "axios";
const BASE_URL = "http://127.0.0.1:8000/api/";
const CREATE_URL = "create/";
const READ_URL = "read/";
const UPDATE_URL = "update/";
const DELETE_URL = "delete/";
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;

// User

const USER_URL = `${BASE_URL}user/`;
const USER_READ_URL = `${USER_URL}${READ_URL}`;

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

// Step
const RECIPE_STEP_URL = `${BASE_URL}recipe/step/`;
const RECIPE_STEPS_UPDATE_ORDER_URL = (stepId: string) =>
    `${RECIPE_STEP_URL}order/${stepId}/`;
const STEP_CREATE_URL = (recipeId: string) =>
    `${BASE_URL}recipe/${recipeId}/step/`;
const STEP_URL = (stepId: string) => `${BASE_URL}recipe/step/${stepId}/`;

// Recipe Steps

const RECIPE_STEPS_URL = `${BASE_URL}steps/recipe/`;
const RECIPE_STEPS_READ_URL = `${RECIPE_STEPS_URL}${READ_URL}`;

// Review

const REVIEW_URL = (recipeId: string) =>
    `${BASE_URL}recipe/${recipeId}/review/`;

// Ingredient

const INGREDIENT_URL = `${BASE_URL}ingredient/`;
const INGREDIENT_READ_URL = (ingredientId: string) =>
    `${INGREDIENT_URL}/${ingredientId}/`;

const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register/`;

// User Profile

const USER_PROFILE_URL = `${BASE_URL}user-profile/`;

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

        return response.data;
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
        const response = await axios.post(
            AUTHENTICATED_URL,
            {},
            { withCredentials: true }
        );
        if (response) {
            return response.data;
        }
    } catch (error) {
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

// User

export const readUser = async () => {
    try {
        const response = await axios.get(USER_READ_URL, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(USER_READ_URL, { withCredentials: true })
        );
    }
};

// Recipes

export const readRecipes = async (
    page: number,
    needUser: boolean,
    privacy?: string,
    filterInput?: string,
    cuisine?: string
) => {
    try {
        const response = await axios.get(RECIPES_READ_URL, {
            params: {
                page,
                needUser,
                ...(privacy && { privacy }),
                ...(filterInput && { filterInput }),
                ...(cuisine && { cuisine }),
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(RECIPES_READ_URL, {
                params: {
                    page,
                    needUser,
                    ...(privacy && { privacy }),
                    ...(filterInput && { filterInput }),
                    ...(cuisine && { cuisine }),
                },
                withCredentials: true,
            })
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
    try {
        const response = await axios.post(
            STEP_CREATE_URL(recipeId),
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
                STEP_URL(recipeId),
                {
                    stepTitle,
                    stepDescription,
                },
                { withCredentials: true }
            )
        );
    }
};

export const updateRecipeStepOrder = async (
    stepId: string,
    moveDown: boolean
) => {
    try {
        const response = await axios.put(
            RECIPE_STEPS_UPDATE_ORDER_URL(stepId),
            { moveDown },
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.put(
                RECIPE_STEPS_UPDATE_ORDER_URL(stepId),
                { moveDown },
                {
                    withCredentials: true,
                }
            )
        );
    }
};

export const updateRecipeStep = async (
    stepId: string,
    title: string,
    description: string
) => {
    // const url = `${RECIPE_STEP_URL}${stepId}/`;
    try {
        const response = await axios.patch(
            STEP_URL(stepId),
            { title, description },
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.patch(
                STEP_URL(stepId),
                { title, description },
                { withCredentials: true }
            )
        );
    }
};

export const deleteRecipeStep = async (stepId: string) => {
    // const url = `${RECIPE_STEP_DELETE_URL}${stepId}/`;
    try {
        const response = await axios.delete(STEP_URL(stepId), {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.delete(STEP_URL(stepId), { withCredentials: true })
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

// Reviews

export const createReview = async (
    recipeId: string,
    rating: number,
    review_text: string
) => {
    try {
        const response = await axios.post(
            REVIEW_URL(recipeId),
            {
                rating,
                review_text,
            },
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.post(
                REVIEW_URL(recipeId),
                {
                    rating,
                    review_text,
                },
                { withCredentials: true }
            )
        );
    }
};

export const readReview = async (recipeId: string) => {
    try {
        const response = await axios.get(REVIEW_URL(recipeId), {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(REVIEW_URL(recipeId), { withCredentials: true })
        );
    }
};

export const updateReview = async (
    recipeId: string,
    rating: number,
    review_text: string
) => {
    try {
        const response = await axios.put(
            REVIEW_URL(recipeId),
            { rating, review_text },
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.put(
                REVIEW_URL(recipeId),
                { rating, review_text },
                { withCredentials: true }
            )
        );
    }
};

export const deleteReview = async (recipeId: string) => {
    try {
        const response = await axios.delete(REVIEW_URL(recipeId), {
            withCredentials: true,
        });
        return response;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.delete(REVIEW_URL(recipeId), { withCredentials: true })
        );
    }
};

// Ingredient

export const createIngredient = async (name: string) => {
    try {
        console.log(name);
        const response = await axios.post(
            INGREDIENT_URL,
            { name },
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.post(INGREDIENT_URL, { name }, { withCredentials: true })
        );
    }
};

// User Profile

export const updateUserProfile = async (
    ingredient: string,
    isOwned: string
) => {
    try {
        const response = await axios.patch(
            USER_PROFILE_URL,
            { ingredient, isOwned },
            { withCredentials: true }
        );
        return response;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.patch(
                USER_PROFILE_URL,
                { ingredient, isOwned },
                { withCredentials: true }
            )
        );
    }
};
