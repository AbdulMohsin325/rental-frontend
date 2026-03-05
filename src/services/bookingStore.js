import { bookings as initialMockBookings, properties as initialMockProperties } from '../data/mockData';

// Initialize store with mock data
let store = [...initialMockBookings];

export const getAllBookings = () => {
    return [...store];
};

export const getUserBookings = (userId) => {
    return store.filter(b => b.userId === userId);
};

export const getReceivedBookings = (ownerId) => {
    // For agents: get bookings for all properties they own
    return store.filter(b => {
        const property = initialMockProperties.find(prop => prop.id === b.propertyId);
        return property && property.ownerId === ownerId;
    });
};

export const addBooking = (bookingData) => {
    const newBooking = {
        ...bookingData,
        id: Date.now(),
        status: 'pending' // New bookings start as pending
    };
    store = [newBooking, ...store];
    return newBooking;
};

export const cancelBooking = (bookingId) => {
    store = store.map(b =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
    );
};

export const acceptBooking = (bookingId) => {
    store = store.map(b =>
        b.id === bookingId ? { ...b, status: 'upcoming' } : b
    );
};

export const rejectBooking = (bookingId) => {
    store = store.map(b =>
        b.id === bookingId ? { ...b, status: 'rejected' } : b
    );
};
