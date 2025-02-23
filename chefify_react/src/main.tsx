import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./contexts/useAuth.tsx";
import PrivateRoutes from "./components/PrivateRoutes.tsx";

import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";

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
