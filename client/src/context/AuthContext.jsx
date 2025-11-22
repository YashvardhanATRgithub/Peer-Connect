import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (name, email, password, college) => {
        const { data } = await api.post('/auth/register', { name, email, password, college });
        return data; // verification required before login
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateProfile = async (updates) => {
        const { data } = await api.put('/auth/me', updates);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
