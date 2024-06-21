import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/blog/user', {
                    credentials: 'include',
                });
                const data = await response.json();
                if (response.ok) {
                    setAuth(data); 
                } else {
                    setAuth(null);
                }
            } catch (error) {
                setAuth(null);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
