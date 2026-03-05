import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_SERVICE;
let isAuthenticated = Boolean(localStorage.getItem('token'));
let isAdmin = false;
let user = null;

export const getIsAuthenticated = () => isAuthenticated;
export const getIsAdmin = () => isAdmin;
export const getUser = () => user;
export const setUser = (value) => {
    user = value ? normalizeUser(value) : null;
};

export const setIsAuthenticated = (value) => {
    isAuthenticated = Boolean(value);
};

const setIsAdmin = (value) => {
    isAdmin = Boolean(value);
};

const normalizeUser = (rawUser = {}) => {
    return {
        fullName: rawUser.fullName || rawUser.name || '',
        email: rawUser.email || '',
        phone: rawUser.phone || rawUser.mobile || '',
        ...rawUser,
    };
};

// Automatically attach the token to all outgoing requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Adjust if your backend expects a different format
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Utility to remove the token on logout
export const logoutUser = async() => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    return { status: true, message: 'Logged out successfully.' };
};
export const registerUser = async (doc) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, doc);
        const payload = response?.data || {};
        if (payload?.status !== 1 && payload?.status !== true) {
            throw new Error(payload?.message || payload?.error || 'Registration failed.');
        }
        const data = payload?.data ?? payload;
        const message = payload?.message || 'Success';
        return { status: true, data, message };
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Registration failed.'
        );
    }
};


export const loginUser = async (doc) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, doc);
        const payload = response?.data || {};
        if (payload?.status !== 1 && payload?.status !== true) {
            throw new Error(payload?.message || payload?.error || 'Login failed.');
        }

        const data = payload?.data ?? payload;
        const message = payload?.message || 'Success';

        const token = data?.token || response?.data?.token;
        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setIsAdmin(false);
        }
        if (data?.user) {
            setUser(data.user);
        } else if (data && !data?.token) {
            setUser(data);
        }

        return { status: true, data, message };
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Login failed.'
        );
    }
};





export const adminLoginUser = async (doc) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/admin/login`, doc);
        const payload = response?.data || {};
        if (payload?.status !== 1 && payload?.status !== true) {
            throw new Error(payload?.message || payload?.error || 'Login failed.');
        }

        const data = payload?.data ?? payload;
        const message = payload?.message || 'Success';

        const token = data?.token || response?.data?.token;
        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            setIsAdmin(true);
        }
        if (data?.user) {
            setUser(data.user);
        } else if (data && !data?.token) {
            setUser(data);
        }

        return { status: true, data, message };
    } catch (error) {
        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Login failed.'
        );
    }
};

export const getMe = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`);
        const payload = response?.data || {};
        if (payload?.status !== 1 && payload?.status !== true) {
            throw new Error(payload?.message || payload?.error || 'Failed to fetch profile.');
        }
        const data = payload?.data ?? payload;
        const message = payload?.message || 'Success';
        const normalizedUser = normalizeUser(data);
        setUser(normalizedUser);
        setIsAdmin(normalizedUser?.isAdmin);
        if (normalizedUser?.isAdmin) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        return { status: true, data: normalizedUser, message };
    } catch (error) {
        if (error?.response?.status === 401) {
            logoutUser();
        }
        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Failed to fetch profile.'
        );
    }
};

export const updateMe = async (doc) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/auth/me`, doc);
        const payload = response?.data || {};
        if (payload?.status !== 1 && payload?.status !== true) {
            throw new Error(payload?.message || payload?.error || 'Failed to update profile.');
        }
        const data = payload?.data ?? payload;
        const message = payload?.message || 'Success';
        const normalizedUser = normalizeUser(data);
        setUser(normalizedUser);
        return { status: true, data: normalizedUser, message };
    } catch (error) {
        if (error?.response?.status === 401) {
            logoutUser();
        }
        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Failed to update profile.'
        );
    }
};
