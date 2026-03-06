import axios from 'axios';

const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

// No auth needed - public endpoint to view booked dates
export const getBookedDatesForProperty = async (houseId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/bookings/house/${houseId}/booked-dates`);
        if (response.data.status === 1 || response.data.status === true) {
            return {
                status: true,
                data: response.data.data,
                message: "Booked dates fetched successfully"
            };
        } else {
            return {
                status: false,
                data: [],
                message: response.data.message || "Failed to fetch booked dates"
            };
        }
    } catch (error) {
        console.error("Error fetching booked dates:", error);
        return {
            status: false,
            data: [],
            message: error.response?.data?.message || "Error fetching booked dates"
        };
    }
};

// Auth required - create a booking
export const createBookingRequest = async (bookingData) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/bookings`, bookingData, authHeader());

        if (response.data.status === 1 || response.data.status === true) {
            return {
                status: true,
                data: response.data.data,
                message: "Booking requested successfully!"
            };
        } else {
            return {
                status: false,
                message: response.data.message || "Failed to submit booking"
            };
        }
    } catch (error) {
        console.error("Error submitting booking:", error);
        return {
            status: false,
            message: error.response?.data?.message || "Error submitting booking"
        };
    }
};

// Auth required - cancel a booking
export const cancelBooking = async (bookingId) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BACKEND_SERVICE}/bookings/${bookingId}/cancel`, {}, authHeader());

        if (response.data.status === 1 || response.data.status === true) {
            return {
                status: true,
                data: response.data.data,
                message: "Booking cancelled successfully!"
            };
        } else {
            return {
                status: false,
                message: response.data.message || "Failed to cancel booking"
            };
        }
    } catch (error) {
        console.error("Error cancelling booking:", error);
        return {
            status: false,
            message: error.response?.data?.message || "Error cancelling booking"
        };
    }
};

// Auth required - get bookings received by property owner
export const getReceivedBookings = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/bookings/owner/list`, authHeader());

        if (response.data.status === 1 || response.data.status === true) {
            return {
                status: true,
                data: response.data.data,
                message: "Received bookings fetched successfully"
            };
        } else {
            return {
                status: false,
                data: [],
                message: response.data.message || "Failed to fetch received bookings"
            };
        }
    } catch (error) {
        console.error("Error fetching received bookings:", error);
        return {
            status: false,
            data: [],
            message: error.response?.data?.message || "Error fetching received bookings"
        };
    }
};

// Auth required - reject a booking (agent/owner)

// Auth required - accept a booking (agent/owner)
export const acceptBooking = async (bookingId) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/bookings/owner/approve`, {
            bookingId: bookingId,
            status: "approved"
        }, authHeader());

        if (response.data.status === 1 || response.data.status === true) {
            return {
                status: true,
                data: response.data.data,
                message: "Booking accepted successfully!"
            };
        } else {
            return {
                status: false,
                message: response.data.message || "Failed to accept booking"
            };
        }
    } catch (error) {
        console.error("Error accepting booking:", error);
        return {
            status: false,
            message: error.response?.data?.message || "Error accepting booking"
        };
    }
};

// Auth required - reject a booking (agent/owner)
export const rejectBooking = async (bookingId) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/bookings/${bookingId}/reject`, {}, authHeader());

        if (response.data.status === 1 || response.data.status === true) {
            return {
                status: true,
                data: response.data.data,
                message: "Booking rejected successfully!"
            };
        } else {
            return {
                status: false,
                message: response.data.message || "Failed to reject booking"
            };
        }
    } catch (error) {
        console.error("Error rejecting booking:", error);
        return {
            status: false,
            message: error.response?.data?.message || "Error rejecting booking"
        };
    }
};

// Auth required - get bookings made by the logged-in user
export const getUserBookings = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/bookings/my`, authHeader());

        if (response.data.status === 1 || response.data.status === true) {
            return {
                status: true,
                data: response.data.data,
                message: "User bookings fetched successfully"
            };
        } else {
            return {
                status: false,
                data: [],
                message: response.data.message || "Failed to fetch user bookings"
            };
        }
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return {
            status: false,
            data: [],
            message: error.response?.data?.message || "Error fetching user bookings"
        };
    }
};
