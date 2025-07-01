import React, { useState, useEffect, ReactNode, useContext } from "react";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { User } from "@/interfaces/interfaces";

interface AuthContextType {
    currentUser: User | null;
    userLoggedIn: boolean;
    loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    async function initializeUser(user: FirebaseUser | null) {
        if (user) {
            const appUser: User = {
                uid: user.uid,
                email: user.email ?? "",
            };
            setCurrentUser(appUser);
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    }

    const value = {
        currentUser,
        userLoggedIn,
        loading,
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, initializeUser);
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
