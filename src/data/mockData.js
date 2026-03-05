export const properties = [
    {
        id: 1,
        title: "Modern Glass Villa in Hollywood Hills",
        price: 12500,
        location: "Los Angeles, CA",
        bedrooms: 4,
        bathrooms: 4.5,
        sqft: 4200,
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60",
        featured: true,
        description: "Experience ultimate luxury in this stunning glass villa featuring panoramic views of the city, a zero-edge infinity pool, and state-of-the-art smart home technology integrating seamlessly with the minimalist design.",
        amenities: ["Infinity Pool", "Smart Home", "Home Theater", "Wine Cellar", "Outdoor Kitchen"],
        ownerId: 1 // owned by current agent user
    },
    {
        id: 2,
        title: "Luxury Penthouse with Skyline Views",
        price: 8500,
        location: "New York, NY",
        bedrooms: 3,
        bathrooms: 3,
        sqft: 2800,
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
        featured: false,
        description: "Unparalleled views from this high-floor penthouse in the heart of the city. Features floor-to-ceiling windows, a private wrap-around terrace, and custom Italian cabinetry.",
        amenities: ["Doorman", "Fitness Center", "Private Terrace", "Valet Parking", "Concierge"],
        ownerId: 1
    },
    {
        id: 3,
        title: "Contemporary Beachfront Estate",
        price: 15000,
        location: "Malibu, CA",
        bedrooms: 5,
        bathrooms: 6,
        sqft: 5500,
        imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=60",
        featured: true,
        description: "Direct beach access from this architectural masterpiece. Featuring a vast open-concept living area that flows directly onto a multi-level deck overlooking the Pacific Ocean.",
        amenities: ["Beach Access", "Guest House", "Spa", "Fire Pit", "Chef's Kitchen"],
        ownerId: 1
    },
    {
        id: 4,
        title: "Architectural Masterpiece in the Woods",
        price: 6200,
        location: "Austin, TX",
        bedrooms: 3,
        bathrooms: 2.5,
        sqft: 3100,
        imageUrl: "https://images.unsplash.com/photo-1600607687931-ce8e0026e4ce?w=800&auto=format&fit=crop&q=60",
        featured: false,
        description: "Nested in nature, this striking property combines organic materials with modern lines. Includes a floating staircase, a serene Japanese garden, and a dedicated wellness studio.",
        amenities: ["Woodland Views", "Zen Garden", "Yoga Studio", "Floor-to-ceiling windows", "Heated Floors"],
        ownerId: 1
    },
    {
        id: 5,
        title: "Sleek Downtown Loft",
        price: 4500,
        location: "Chicago, IL",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1800,
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=60",
        featured: false,
        description: " Industrial chic meets luxury in this converted warehouse loft. Features exposed brick, 15-foot ceilings, and high-end industrial grade appliances.",
        amenities: ["Exposed Brick", "High Ceilings", "Rooftop Access", "Smart Lighting", "Walk-in Closet"],
        ownerId: 1
    },
    {
        id: 6,
        title: "Mediterranean Revival Mansion",
        price: 18000,
        location: "Miami, FL",
        bedrooms: 6,
        bathrooms: 7.5,
        sqft: 8000,
        imageUrl: "https://images.unsplash.com/photo-1613490908575-9b24ff7e1e69?w=800&auto=format&fit=crop&q=60",
        featured: true,
        description: "A sprawling estate offering the best of indoor/outdoor living. Features a resort-style pool with cabanas, a private dock, and meticulously manicured gardens.",
        amenities: ["Private Dock", "Resort Pool", "Tennis Court", "Home Gym", "Gated Entry"],
        ownerId: 2 // owned by another agent
    }
];

export const bookings = [
    {
        id: 101,
        propertyId: 1, // owned by ownerId: 1
        userId: 2,     // booked by another user
        checkIn: "2026-04-15",
        checkOut: "2026-04-20",
        guests: 2,
        totalPrice: 62500,
        status: "pending"
    },
    {
        id: 102,
        propertyId: 6, // owned by ownerId: 2
        userId: 1,     // booked by current user (renter)
        checkIn: "2026-03-10",
        checkOut: "2026-03-14",
        guests: 4,
        totalPrice: 72000,
        status: "completed"
    },
    {
        id: 103,
        propertyId: 5, // owned by ownerId: 1
        userId: 2,     // booked by another user
        checkIn: "2026-05-01",
        checkOut: "2026-05-05",
        guests: 1,
        totalPrice: 18000,
        status: "pending"
    },
    {
        id: 104,
        propertyId: 4, // owned by ownerId: 1
        userId: 1,     // booked by current user (renter)
        checkIn: "2025-12-20",
        checkOut: "2025-12-25",
        guests: 2,
        totalPrice: 31000,
        status: "cancelled"
    }
];
