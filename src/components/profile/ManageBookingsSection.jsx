import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Search, Calendar, Users, Ban, CircleCheck, CheckCircle2 } from 'lucide-react';
import { getAllProperties } from '../../services/propertyStore';
import { getReceivedBookings, cancelBooking, acceptBooking, rejectBooking } from '../../services/bookingStore';
import toast from 'react-hot-toast';

const ManageBookingsSection = () => {
    const [bookings, setBookings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        // Assume ownerId = 1 for the mock agent
        setBookings(getReceivedBookings(1));
        setProperties(getAllProperties());
    };

    const handleCancelBooking = (bookingId) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            cancelBooking(bookingId);
            toast.success("Booking cancelled successfully.");
            loadData(); // Refresh list
        }
    };

    const handleAcceptBooking = (bookingId) => {
        acceptBooking(bookingId);
        toast.success("Booking enquiry accepted!");
        loadData();
    };

    const handleRejectBooking = (bookingId) => {
        if (window.confirm("Are you sure you want to reject this booking enquiry?")) {
            rejectBooking(bookingId);
            toast.success("Booking enquiry rejected.");
            loadData();
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

    // Formatting date helper
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Booking Enquiries</h2>
                    <p className="text-slate-500 text-sm">View upcoming and past booking requests for your properties</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search properties..."
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
                        <option value="all">All Enquiries</option>
                        <option value="pending">Pending Review</option>
                        <option value="upcoming">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled by User</option>
                        <option value="rejected">Rejected by You</option>
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
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">No enquiries found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            {searchTerm || statusFilter !== 'all'
                                ? "We couldn't find any enquiries matching your current filters."
                                : "You haven't received any booking requests yet."}
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
                                    <div className="w-full lg:w-64 h-48 lg:h-auto shrink-0 relative rounded-xl overflow-hidden bg-slate-100">
                                        <img
                                            src={property.imageUrl}
                                            alt={property.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${booking.status === 'upcoming' ? 'bg-emerald-500/90 text-white' :
                                                    booking.status === 'pending' ? 'bg-amber-500/90 text-white' :
                                                        booking.status === 'completed' ? 'bg-blue-500/90 text-white' :
                                                            'bg-rose-500/90 text-white'
                                                }`}>
                                                {booking.status === 'upcoming' ? 'Confirmed' :
                                                    booking.status === 'pending' ? 'Pending Review' :
                                                        booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="flex-1 flex flex-col">

                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-1">{property.title}</h3>
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
                                            {booking.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAcceptBooking(booking.id)}
                                                        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
                                                    >
                                                        <CircleCheck size={16} className="mr-2" />
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectBooking(booking.id)}
                                                        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                                                    >
                                                        <Ban size={16} className="mr-2" />
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {booking.status === 'upcoming' && (
                                                <div className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-emerald-600 bg-emerald-50 border border-emerald-200">
                                                    <CircleCheck size={16} className="mr-2" />
                                                    Confirmed
                                                </div>
                                            )}
                                            {booking.status === 'completed' && (
                                                <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-50 rounded-lg border border-slate-100">
                                                    <CheckCircle2 size={16} className="mr-2" />
                                                    Stay Completed
                                                </div>
                                            )}
                                            {booking.status === 'rejected' && (
                                                <div className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-lg border border-rose-100">
                                                    <Ban size={16} className="mr-2" />
                                                    Rejected
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
    );
};

export default ManageBookingsSection;
