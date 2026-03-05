import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Search, Calendar, Users, Ban, CircleCheck, CheckCircle2 } from 'lucide-react';
import { getAllProperties } from '../services/propertyStore';
import { getUserBookings, cancelBooking } from '../services/bookingStore';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const MyTripsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Assume userId = 1 for the mock renter
        setBookings(getUserBookings(1));
        setProperties(getAllProperties());
    };

    const handleCancelBooking = (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this trip?")) {
            cancelBooking(bookingId);
            toast.success("Trip cancelled successfully.");
            loadData(); // Refresh list
        }
    };

    const getPropertyDetails = (propertyId) => {
        return properties.find(p => p.id === propertyId) || null;
    };

    // Filter bookings
    const filteredBookings = bookings.filter(booking => {
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        const property = getPropertyDetails(booking.propertyId);
        const matchesSearch = property && (
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return matchesStatus && (searchTerm === '' || matchesSearch);
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Header */}
                    <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">My Trips</h1>
                            <p className="text-slate-500">View and manage all your past and upcoming stays</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search size={16} className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Filter */}
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                            >
                                <option value="all">All Trips</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        {filteredBookings.length === 0 ? (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <CalendarDays size={32} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No trips found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    {searchTerm || statusFilter !== 'all'
                                        ? "We couldn't find any trips matching your current filters."
                                        : "You haven't booked any trips yet. Start exploring properties!"}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredBookings.map(booking => {
                                    const property = getPropertyDetails(booking.propertyId);
                                    if (!property) return null;

                                    return (
                                        <div key={booking.id} className="flex flex-col lg:flex-row gap-6 p-5 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow duration-300 bg-white group">

                                            {/* Property Image */}
                                            <div className="w-full lg:w-72 h-52 lg:h-auto shrink-0 relative rounded-xl overflow-hidden bg-slate-100">
                                                <img
                                                    src={property.imageUrl}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${booking.status === 'upcoming' ? 'bg-blue-500/90 text-white' :
                                                            booking.status === 'completed' ? 'bg-emerald-500/90 text-white' :
                                                                'bg-rose-500/90 text-white'
                                                        }`}>
                                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Booking Details */}
                                            <div className="flex-1 flex flex-col">

                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-2xl font-bold text-slate-900 mb-1">{property.title}</h3>
                                                        <div className="flex items-center text-slate-500 text-sm">
                                                            <MapPin size={14} className="mr-1" />
                                                            {property.location}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-slate-900">${booking.totalPrice.toLocaleString()}</div>
                                                        <div className="text-sm text-slate-500">Total amount</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 my-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <div>
                                                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={12} /> Check-in</div>
                                                        <div className="font-semibold text-slate-900">{formatDate(booking.checkIn)}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={12} /> Check-out</div>
                                                        <div className="font-semibold text-slate-900">{formatDate(booking.checkOut)}</div>
                                                    </div>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                                    <div className="flex items-center text-sm font-medium text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                                        <Users size={16} className="mr-2 text-primary-500" />
                                                        {booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    {booking.status === 'upcoming' && (
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                                                        >
                                                            <Ban size={16} className="mr-2" />
                                                            Cancel Reservation
                                                        </button>
                                                    )}
                                                    {booking.status === 'completed' && (
                                                        <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
                                                            <CheckCircle2 size={16} className="mr-2" />
                                                            Stay Completed
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyTripsPage;
