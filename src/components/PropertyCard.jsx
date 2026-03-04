import React from 'react';
import { MapPin, BedDouble, Bath, SquareFunction, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
    const { id, title, price, location, bedrooms, bathrooms, sqft, imageUrl, featured } = property;

    return (
        <Link to={`/property/${id}`} className="group block focus:outline-none">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 transform group-hover:-translate-y-2 group-focus-visible:ring-4 ring-primary-500/50">

                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={imageUrl || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60"}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>

                    {/* Top Actions/Badges */}
                    <div className="absolute top-4 w-full px-4 flex justify-between items-start">
                        {featured ? (
                            <span className="px-3 py-1 text-xs font-semibold bg-primary-500 text-white rounded-full shadow-lg backdrop-blur-md">
                                Featured
                            </span>
                        ) : (
                            <div></div>
                        )}
                        <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors duration-300">
                            <Heart size={20} />
                        </button>
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-4 left-4">
                        <h3 className="text-2xl font-bold text-white drop-shadow-md">
                            ${price.toLocaleString()}<span className="text-sm font-normal text-white/80">/mo</span>
                        </h3>
                    </div>
                </div>

                {/* Content Details */}
                <div className="p-6">
                    <h4 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                        {title}
                    </h4>

                    <div className="flex items-center text-slate-500 text-sm mb-4">
                        <MapPin size={16} className="mr-1.5 text-primary-500" />
                        <span className="truncate">{location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-600">
                            <BedDouble size={18} className="text-slate-400" />
                            <span className="font-medium">{bedrooms} <span className="text-slate-400 text-sm font-normal">Beds</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Bath size={18} className="text-slate-400" />
                            <span className="font-medium">{bathrooms} <span className="text-slate-400 text-sm font-normal">Baths</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <SquareFunction size={18} className="text-slate-400" />
                            <span className="font-medium">{sqft} <span className="text-slate-400 text-sm font-normal">sqft</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
