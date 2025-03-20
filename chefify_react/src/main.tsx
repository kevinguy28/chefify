import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./contexts/useAuth.tsx";
import PrivateRoutesAuthenticated from "./components/PrivateRoutesAuthenticated.tsx";
import PrivateRoutesUserRecipe from "./components/PrivateRoutesUserRecipe.tsx";

import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import RecipePage from "./pages/RecipePage.tsx";
import RecipeEdit from "./pages/RecipeEdit.tsx";
import Banner from "./components/Banner.tsx";
import RecipeEditCatalog from "./components/RecipeEditCatalog.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoutesAuthenticated>
                                <Banner />
                                <Home />
                            </PrivateRoutesAuthenticated>
                        }
                    />
                    <Route
                        path="/recipe/:recipeId"
                        element={
                            <PrivateRoutesAuthenticated>
                                <Banner />
                                <RecipePage />
                            </PrivateRoutesAuthenticated>
                        }
                    />
                    <Route
                        path="/recipe/edit-catalog/"
                        element={
                            <PrivateRoutesAuthenticated>
                                <Banner />
                                <RecipeEditCatalog />
                            </PrivateRoutesAuthenticated>
                        }
                    />
                    <Route
                        path="/recipe/update/:recipeId"
                        element={
                            <PrivateRoutesAuthenticated>
                                <PrivateRoutesUserRecipe>
                                    <Banner />
                                    <RecipeEdit />
                                </PrivateRoutesUserRecipe>
                            </PrivateRoutesAuthenticated>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <PrivateRoutesAuthenticated>
                                <Banner />
                                <Home />
                            </PrivateRoutesAuthenticated>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
