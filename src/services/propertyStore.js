import { properties as initialMockProperties } from '../data/mockData';

// Initialize store with mock data, treating them all as 'approved' by default so they show up.
let store = [...initialMockProperties.map(p => ({ ...p, status: 'approved' }))];

export const getAllProperties = () => {
    return [...store];
};

export const getApprovedProperties = () => {
    return store.filter(p => p.status === 'approved');
};

export const addProperty = (propertyData) => {
    const newProperty = {
        ...propertyData,
        id: Date.now(), // simple unique id
        featured: false,
        status: 'pending' // new properties need admin approval
    };
    store = [newProperty, ...store];
    return newProperty;
};

export const updatePropertyStatus = (id, newStatus) => {
    store = store.map(p =>
        p.id === id ? { ...p, status: newStatus } : p
    );
};
