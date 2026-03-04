import axios from 'axios';



export const registerUser = async (doc) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/auth/register`, doc);

    // axios throws for non-2xx so this manual check might not be needed, but for clarity if custom statuses:
    if (response.status >= 400) {
        throw new Error(response.data?.message || response.data?.error || 'Registration failed.');
    }

    return response.data;
};
