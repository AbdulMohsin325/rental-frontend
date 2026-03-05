import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getIsAuthenticated, getMe } from '../services/auth';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [isUserLoading, setIsUserLoading] = useState(true); // true so AdminRoute waits for auth check on refresh

    const refreshUserDetails = useCallback(async () => {
        if (!getIsAuthenticated()) {
            setUserDetails(null);
            setIsUserLoading(false); // ensure loading clears for unauthenticated users
            return null;
        }

        try {
            setIsUserLoading(true);
            const res = await getMe();
            if (res.status) {
                setUserDetails(res.data);
                return res.data;
            }
            return null;
        } catch {
            setUserDetails(null);
            return null;
        } finally {
            setIsUserLoading(false);
        }
    }, []);

    const clearUserDetails = useCallback(() => setUserDetails(null), []);

    useEffect(() => {
        refreshUserDetails();
    }, [refreshUserDetails]);

    const value = useMemo(() => ({
        userDetails,
        setUserDetails,
        isUserLoading,
        refreshUserDetails,
        clearUserDetails,
    }), [userDetails, isUserLoading, refreshUserDetails, clearUserDetails]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
