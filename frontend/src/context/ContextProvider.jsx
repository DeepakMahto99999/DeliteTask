import { createContext, useContext, useState, useEffect } from 'react'

const authContext = createContext()

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const [loading, setLoading] = useState(true);

    // 🔧 NEW: Check for existing user on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                // Clear invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    // 🔧 NEW: Add logout function to clear user data and tokens
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('keepLoggedIn');
        console.log('User data cleared from context and localStorage');
    };

    // 🔧 NEW: Helper function to check if user is authenticated
    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem('token');
    };

    return (
        <authContext.Provider value={{ 
            user, 
            login, 
            logout,      // 🔧 NEW: Provide logout function
            isAuthenticated, // 🔧 NEW: Provide authentication check
            loading      // 🔧 NEW: Provide loading state
        }}>
            {children}
        </authContext.Provider>
    )
}

export const useAuth = () => useContext(authContext)
export default ContextProvider