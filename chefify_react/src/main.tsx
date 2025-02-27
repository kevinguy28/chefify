import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./contexts/useAuth.tsx";
import PrivateRoutes from "./components/PrivateRoutes.tsx";

import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import RecipeEdit from "./pages/RecipeEdit.tsx";
import Banner from "./components/Banner.tsx";

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
                            <PrivateRoutes>
                                <Home />
                            </PrivateRoutes>
                        }
                    />
                    <Route
                        path="/recipe/:recipeId"
                        element={
                            <PrivateRoutes>
                                <RecipeEdit />
                            </PrivateRoutes>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <PrivateRoutes>
                                <Home />
                            </PrivateRoutes>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
