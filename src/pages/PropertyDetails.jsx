import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPropertyById } from '../services/propertyStore';
import { getBookedDatesForProperty, createBookingRequest } from '../services/bookingStore';
import { MapPin, BedDouble, Bath, SquareFunction, CheckCircle2, Navigation, MessageCircle, Home } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { addDays, parseISO } from 'date-fns';

const tourSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().min(10, 'Valid phone number is required'),
    message: z.string().min(10, 'Please provide more details (at least 10 chars)'),
});

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [excludeIntervals, setExcludeIntervals] = useState([]);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        fetchProperty(id);
        fetchBookedDates(id);
    }, [id]);




    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(tourSchema),
    });


    const fetchProperty = async (id) => {
        const res = await getPropertyById(id);
        if (res.status) {
            setProperty(res.data);
        }
    };

    const fetchBookedDates = async (id) => {
        const res = await getBookedDatesForProperty(id);
        if (res.status && res.data) {
            const intervals = res.data.map(booking => ({
                start: parseISO(booking.startDate),
                end: parseISO(booking.endDate)
            }));
            setExcludeIntervals(intervals);
        }
    };

    const handleBookingSubmit = async () => {
        if (!startDate || !endDate || !property) return;

        setIsBooking(true);
        const res = await createBookingRequest({
            houseId: property.homeId || property._id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        });

        if (res.status) {
            toast.success('Tour request sent successfully!');
            setDateRange([null, null]);
            fetchBookedDates(id); // Refresh disabled dates
        } else {
            toast.error(res.message || 'Failed to send request. Please try again or login first.');
        }
        setIsBooking(false);
    };

    if (!property) return (
        <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-slate-50">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Property not found</h2>
            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2">
                <Home size={20} /> Back to Home
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-16">

            {/* Property Hero Image */}
            <div className="w-full h-[50vh] min-h-[400px] relative">
                <img
                    src={property.thumbnail}
                    alt={property.title}
                    className="w-full h-full object-cover animate-fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 animate-slide-up">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">

                            <div className="text-white max-w-3xl">
                                {property.featured && (
                                    <span className="inline-block px-4 py-1.5 bg-primary-500/90 backdrop-blur-md rounded-full text-sm font-semibold mb-4 shadow-lg">
                                        Featured Property
                                    </span>
                                )}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-md mb-4 text-balance">
                                    {property.title}
                                </h1>
                                <div className="flex items-center gap-2 text-white/90 text-lg">
                                    <MapPin size={22} className="text-primary-400" />
                                    <span>{property.location}</span>
                                </div>
                            </div>

                            <div className="glass-dark p-6 rounded-2xl md:min-w-[300px] text-white">
                                <p className="text-white/70 text-sm font-medium mb-1 uppercase tracking-wider">Asking Price</p>
                                <h3 className="text-4xl font-bold mb-4">
                                    ${property.price.toLocaleString()}<span className="text-xl font-normal text-white/70">/mo</span>
                                </h3>
                                <button className="w-full py-3.5 bg-primary-500 hover:bg-primary-600 rounded-xl font-bold transition-colors shadow-lg shadow-primary-500/30 flex justify-center items-center gap-2">
                                    <MessageCircle size={20} />
                                    Contact Agent
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">

                {/* Quick Stats Bar */}
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex items-center justify-between overflow-x-auto gap-8 mb-12 border border-slate-100">
                    <div className="flex flex-col items-center justify-center min-w-[100px]">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                            <BedDouble size={24} className="text-primary-600" />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{property.bedrooms}</span>
                        <span className="text-slate-500 text-sm font-medium">Bedrooms</span>
                    </div>
                    <div className="w-px h-16 bg-slate-100 hidden sm:block"></div>

                    <div className="flex flex-col items-center justify-center min-w-[100px]">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                            <Bath size={24} className="text-primary-600" />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{property.bathrooms}</span>
                        <span className="text-slate-500 text-sm font-medium">Bathrooms</span>
                    </div>
                    <div className="w-px h-16 bg-slate-100 hidden sm:block"></div>

                    <div className="flex flex-col items-center justify-center min-w-[100px]">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                            <SquareFunction size={24} className="text-primary-600" />
                        </div>
                        <span className="text-2xl font-bold text-slate-800">{property.sqft.toLocaleString()}</span>
                        <span className="text-slate-500 text-sm font-medium">Square Feet</span>
                    </div>
                    <div className="w-px h-16 bg-slate-100 hidden md:block"></div>

                    <div className="flex flex-col items-center justify-center min-w-[100px] md:flex hidden">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                            <Navigation size={24} className="text-primary-600" />
                        </div>
                        <span className="text-lg font-bold text-slate-800 text-center">{property.address.city}</span>
                        <span className="text-slate-500 text-sm font-medium">Location</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Detailed Info */}
                    <div className="lg:col-span-2 space-y-12 animate-slide-up">

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">About this home</h2>
                            <div className="prose prose-lg text-slate-600">
                                <p className="leading-relaxed">{property.description}</p>
                                <p className="mt-4 leading-relaxed">
                                    Every detail has been carefully considered to provide the ultimate luxury living experience.
                                    From the high-end finishes to the thoughtful layout, this space is designed for both
                                    extravagant entertaining and peaceful relaxation.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">Premium Amenities</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                                {property.amenities.map((amenity, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle2 size={24} className="text-primary-500 shrink-0" />
                                        <span className="text-lg text-slate-700 font-medium">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Property Gallery</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {(property.images?.length > 0 ? property.images : [property.imageUrl || property.thumbnail].filter(Boolean)).map((img, index) => (
                                    <div key={index} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <img
                                            src={img}
                                            alt={`${property.title} view ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Book Your Stay</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Select Dates</label>
                                    <DatePicker
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={(update) => {
                                            setDateRange(update);
                                        }}
                                        minDate={new Date()}
                                        excludeDateIntervals={excludeIntervals}
                                        monthsShown={1}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer text-slate-700"
                                        placeholderText="Add dates"
                                        dateFormat="MMM d, yyyy"
                                        isClearable
                                    />
                                </div>

                                {startDate && endDate && (
                                    <div className="bg-slate-50 p-4 rounded-xl space-y-3 mt-6 border border-slate-100">
                                        <div className="flex justify-between text-slate-600">
                                            <span>${property.price.toLocaleString()} x {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))} nights</span>
                                            <span>${(property.price * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))).toLocaleString()}</span>
                                        </div>
                                        <div className="h-px bg-slate-200 w-full my-2"></div>
                                        <div className="flex justify-between font-bold text-slate-900 text-lg">
                                            <span>Total</span>
                                            <span>${(property.price * Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))).toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleBookingSubmit}
                                    disabled={isBooking || !startDate || !endDate}
                                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2">
                                    {isBooking ? 'Processing...' : 'Request to Book'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
