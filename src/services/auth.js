import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_SERVICE;
let isAdmin = false;
let user = null;

const TOKEN_STORAGE_KEY = 'token';

const extractToken = (payload) => {
    if (!payload || typeof payload !== 'object') return null;

    // Common token field names / nesting patterns across backends.
    const candidates = [
        payload?.token,
        payload?.accessToken,
        payload?.access_token,
        payload?.jwt,
        payload?.data?.token,
        payload?.data?.accessToken,
        payload?.data?.access_token,
        payload?.data?.jwt,
        payload?.data?.data?.token,
        payload?.data?.data?.accessToken,
        payload?.data?.data?.access_token,
        payload?.result?.token,
        payload?.result?.accessToken,
        payload?.result?.access_token,
        payload?.user?.token,
    ];

    for (const t of candidates) {
        if (typeof t === 'string' && t.trim()) return t.trim();
    }
    return null;
};

const getStoredToken = () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) return null;
    const trimmed = String(token).trim();
    if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return null;
    return trimmed;
};

const setStoredToken = (token) => {
    if (!token) return;
    const str = String(token).trim();
    if (!str || str === 'undefined' || str === 'null') return;
    try {
        localStorage.setItem(TOKEN_STORAGE_KEY, str);
        if (import.meta.env.DEV) {
            console.info('[auth] Token stored in localStorage.');
            const readBack = localStorage.getItem(TOKEN_STORAGE_KEY);
            if (readBack !== str) {
                console.warn('[auth] Token write verification failed. Read-back value did not match.');
            }
        }
    } catch (e) {
        if (import.meta.env.DEV) {
            console.warn('[auth] Failed to write token to localStorage.', e);
        }
    }
};

const clearStoredToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getIsAuthenticated = () => Boolean(getStoredToken());
export const getIsAdmin = () => isAdmin;
export const getUser = () => user;
export const setUser = (value) => {
    user = value ? normalizeUser(value) : null;
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
        const token = getStoredToken();
        if (token) {
            const authValue = token.toLowerCase().startsWith('bearer ') ? token : `Bearer ${token}`;
            // Axios v1 may use AxiosHeaders; support both shapes.
            if (!config.headers) config.headers = {};
            if (typeof config.headers.set === 'function') {
                config.headers.set('Authorization', authValue);
                // Common alternate conventions used by many backends/middlewares.
                config.headers.set('x-auth-token', token);
                config.headers.set('x-access-token', token);
            } else {
                config.headers.Authorization = authValue;
                config.headers['x-auth-token'] = token;
                config.headers['x-access-token'] = token;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Dev-only: help diagnose why authenticated endpoints return 401.
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (import.meta.env.DEV && error?.response?.status === 401) {
            const url = error?.config?.url;
            const method = (error?.config?.method || '').toUpperCase();
            const authHeader =
                (typeof error?.config?.headers?.get === 'function' && error.config.headers.get('Authorization')) ||
                error?.config?.headers?.Authorization ||
                error?.config?.headers?.authorization;
            const authPreview =
                typeof authHeader === 'string'
                    ? authHeader.split(' ').slice(0, 2).join(' ') // e.g. "Bearer eyJ..."
                    : null;
            console.warn('[auth] 401 Unauthorized', { method, url, hasAuthHeader: Boolean(authHeader), authPreview });
        }
        return Promise.reject(error);
    }
);

// Utility to remove the token on logout
export const logoutUser = async() => {
    clearStoredToken();
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

        const token = extractToken(payload);
        if (token) {
            setStoredToken(token);
            setIsAdmin(false);
        } else if (import.meta.env.DEV) {
            console.warn('[auth] Login succeeded but no token found in response payload shape.');
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

        const token = extractToken(payload);
        if (token) {
            setStoredToken(token);
            setIsAdmin(true);
        } else if (import.meta.env.DEV) {
            console.warn('[auth] Admin login succeeded but no token found in response payload shape.');
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
        // Avoid wiping localStorage automatically on 401.
        // Some backends may briefly return 401 during bootstrapping, role checks, or if the token shape is unexpected.
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
        // Avoid wiping localStorage automatically on 401.
        throw new Error(
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Failed to update profile.'
        );
    }
};
