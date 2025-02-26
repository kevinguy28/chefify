import axios, { AxiosResponse } from "axios";
const BASE_URL = "http://127.0.0.1:8000/api/";
const CREATE_URL = "create/";
const LOGIN_URL = `${BASE_URL}token/`;
const REFRESH_URL = `${BASE_URL}token/refresh/`;

// Recipes
const RECIPE_URL = `${BASE_URL}recipes/`;
const RECIPE_CREATE_URL = `${RECIPE_URL}${CREATE_URL}/`;
const LOGOUT_URL = `${BASE_URL}logout/`;
const AUTHENTICATED_URL = `${BASE_URL}authenticated/`;
const REGISTER_URL = `${BASE_URL}register/`;
const CUISINE_URL = `${BASE_URL}cuisine/`;
const CREATE_CUISINE_URL = `${CUISINE_URL}${CREATE_URL}`;

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

export const get_recipes = async () => {
    try {
        const response = await axios.get(RECIPE_URL, { withCredentials: true });
        return response.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(RECIPE_URL, { withCredentials: true })
        );
    }
};

export const create_cuisine = async (
    recipeName: string,
    cuisine: string,
    privacy: string
) => {
    try {
        const reponse = await axios.post(
            RECIPE_CREATE_URL,
            {
                recipeName,
                cuisine,
                privacy,
            },
            { withCredentials: true }
        );
        return reponse.data;
    } catch (error) {
        return await call_refresh(error, () =>
            axios.get(RECIPE_CREATE_URL, { withCredentials: true })
        );
    }
};

export const get_cuisines = async () => {
    try {
        console.log(CUISINE_URL);
        console.log("ss");
        const response = await axios.get(CUISINE_URL, {
            withCredentials: true,
        });
        console.log(response.data);
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
