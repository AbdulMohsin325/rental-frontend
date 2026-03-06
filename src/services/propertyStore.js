import axios from 'axios';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getAllProperties = async (page = 1, limit = 10, search = '') => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/list`, {
            params: { page, limit, search },
            ...authHeader()
        })
        if (response.data.status == 1) {
            return ({
                status: true,
                data: response.data.data,
                page: response.data.page,
                totalPages: response.data.totalPages,
                total: response.data.total,
                message: response.data.message || "Properties fetched successfully"
            })
        }
        return ({
            status: false,
            data: [],
            message: response.data.message || "Failed to fetch properties"
        })
    }
    catch (error) {
        console.error("Error fetching properties:", error);
        return ({
            status: false,
            data: [],
            message: error.message || "Error fetching properties"
        })
    }
};

export const getProperties = async (page = 1, limit = 10, search = '') => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/admin`, {
            params: { page, limit, search },
            ...authHeader()
        })
        if (response.data.status == 1) {
            return ({
                status: true,
                data: response.data.data,
                page: response.data.page,
                totalPages: response.data.totalPages,
                total: response.data.total,
                message: response.data.message || "Properties fetched successfully"
            })
        }
        return ({
            status: false,
            data: [],
            message: response.data.message || "Failed to fetch properties"
        })
    }
    catch (error) {
        console.error("Error fetching properties:", error);
        return ({
            status: false,
            data: [],
            message: error.message || "Error fetching properties"
        })
    }
};

export const getApprovedProperties = async (page = 1, limit = 9, search = '') => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/`, {
            params: { page, limit, search }
        })
        if (response.data.status === 1 || response.data.status === true) {
            return ({
                status: true,
                data: response.data.data,
                page: response.data.page,
                totalPages: response.data.totalPages,
                total: response.data.total,
                message: response.data.message || "Approved properties fetched successfully"
            })
        }
        else {
            return ({
                status: false,
                data: [],
                message: response.data.message || "Failed to fetch approved properties"
            })
        }
    } catch (error) {
        console.error("Error fetching approved properties:", error);
        return ({
            status: false,
            data: [],
            message: error.message || "Error fetching approved properties"
        })
    }
}

export const updatePropertyStatus = async (id, newStatus) => {
    try {
        const formatStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/${id}/status`, { status: formatStatus }, authHeader());

        if (response.data.status === 1 || response.data.status === true) {
            return {
                status: true,
                data: response.data.data,
                message: response.data.message || `Property ${formatStatus.toLowerCase()} successfully`
            };
        } else {
            return {
                status: false,
                message: response.data.message || `Failed to update property to ${formatStatus}`
            };
        }
    } catch (error) {
        console.error("Error updating property status:", error);
        return {
            status: false,
            message: error.response?.data?.message || "Error updating property status"
        };
    }
};

export const addProperty = async (propertyData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/add`, propertyData, authHeader())
        if (response.data.status === 1 || response.data.status === true) {
            return ({
                status: true,
                data: response.data.data,
                message: response.data.message || "Property added successfully"
            })
        }
        else {
            return ({
                status: false,
                message: response.data.message || "Failed to add property"
            })
        }
    } catch (error) {
        console.error("Error adding property:", error);
        throw error;
    }
}

export const getPropertyById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/${id}`)
        if (response.data.status === 1 || response.data.status === true) {
            return ({
                status: true,
                data: response.data.data,
                message: response.data.message || "Property fetched successfully"
            })
        }
        else {
            return ({
                status: false,
                message: response.data.message || "Failed to fetch property"
            })
        }
    } catch (error) {
        console.error("Error fetching property:", error);
        throw error;
    }
}

export const updateProperty = async (id, propertyData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/${id}`, propertyData, authHeader())
        if (response.data.status === 1 || response.data.status === true) {
            return ({
                status: true,
                data: response.data.data,
                message: response.data.message || "Property updated successfully"
            })
        }
        else {
            return ({
                status: false,
                message: response.data.message || "Failed to update property"
            })
        }
    } catch (error) {
        console.error("Error updating property:", error);
        throw error;
    }
}

export const updatePropertyActiveStatus = async (id, isActive) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/${id}/active`, { isActive }, authHeader())
        if (response.data.status === 1 || response.data.status === true) {
            return ({
                status: true,
                data: response.data.data,
                message: response.data.message || "Property status updated successfully"
            })
        }
        else {
            return ({
                status: false,
                message: response.data.message || "Failed to update property status"
            })
        }
    } catch (error) {
        console.error("Error updating property status:", error);
        throw error;
    }
}