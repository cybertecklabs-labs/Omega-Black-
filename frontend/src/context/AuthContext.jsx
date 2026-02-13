import { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, logout } from '../redux/slices/authSlice';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // In a real app, you'd verify the token or fetch user profile here
            // For now, we'll assume the presence of a token means authenticated
            // Normally you'd call getMeQuery but we're just setting up the scaffold
        }
        setLoading(false);
    }, [dispatch]);

    return (
        <AuthContext.Provider value={{}}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
