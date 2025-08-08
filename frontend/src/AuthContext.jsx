import React, { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores user object { _id, name, email, role, token, department }
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('resolveEaseUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user from localStorage:", error);
                localStorage.removeItem('resolveEaseUser');
            }
        }
        setLoadingAuth(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('resolveEaseUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('resolveEaseUser');
    };

    const isAdmin = user && user.role === 'admin';
    const isEmployee = user && user.role === 'employee';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isEmployee, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);