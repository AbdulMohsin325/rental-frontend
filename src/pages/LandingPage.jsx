import React, { useEffect, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import { getApprovedProperties } from '../services/propertyStore';
import { Search, MapPin, Home } from 'lucide-react';
import { getIsAuthenticated, getMe } from '../services/auth';

const LandingPage = () => {
    const [approvedProperties, setApprovedProperties] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

    useEffect(() => {
        if (!getIsAuthenticated()) return;
        getMe().catch(() => { });
    }, []);

    const fetchProperties = async (pageNum, isLoadMore = false, searchParam = activeSearch) => {
        setIsLoading(true);
        const res = await getApprovedProperties(pageNum, 9, searchParam);
        if (res.status && res.data) {
            const mappedProperties = res.data.map(p => ({
                ...p,
                id: p.homeId || p._id,
                location: p.city || p.address?.city || p.address?.street || 'Location not specified',
                imageUrl: p.thumbnail || p.images?.[0] || '',
                featured: false // Add featured logic here if available in backend
            }));

            if (isLoadMore) {
                setApprovedProperties(prev => [...prev, ...mappedProperties]);
            } else {
                setApprovedProperties(mappedProperties);
            }

            setTotalPages(res.totalPages || Math.ceil((res.total || 0) / 9));
        } else if (!isLoadMore) {
            setApprovedProperties([]);
            setTotalPages(1);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProperties(1, false, '');
    }, []);

    const handleSearch = () => {
        setActiveSearch(searchQuery);
        setPage(1);
        fetchProperties(1, false, searchQuery);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
            window.scrollTo({
                top: document.getElementById('properties-section')?.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchProperties(nextPage, true, activeSearch);
        }
    };

    const featured = approvedProperties.filter(p => p.featured);

    return (
        <div className="min-h-screen pt-16">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80"
                        alt="Hero Luxury Home"
                        className="w-full h-full object-cover animate-fade-in"
                    />
                    <div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center animate-slide-up">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg leading-tight">
                        Discover Your Next <span className="text-primary-500">Perfect</span> Home
                    </h1>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
                        Explore the most premium selection of properties curated just for you. Find spaces that inspire your everyday.
                    </p>

                    {/* Search Bar */}
                    <div className="glass max-w-4xl mx-auto p-3 rounded-full flex flex-col sm:flex-row items-center gap-2 shadow-2xl">
                        <div className="flex-1 flex items-center bg-white/10 rounded-full px-4 py-3 w-full backdrop-blur-md">
                            <Search className="text-white/70 mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="Search by location or neighborhood..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/60 focus:ring-0"
                            />
                        </div>

                        <button
                            onClick={() => {
                                handleSearch();
                                window.scrollTo({
                                    top: document.getElementById('properties-section')?.offsetTop - 80,
                                    behavior: 'smooth'
                                });
                            }}
                            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                        >
                            <Search size={18} />
                            <span>Search Properties</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Properties Showcase */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Listings</h2>
                            <p className="text-slate-600 max-w-2xl text-lg">Handpicked luxury properties selected for their exceptional design and unparalleled amenities.</p>
                        </div>
                        <button className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                            View all listings
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featured.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </div>
            </section>

            {/* All Properties */}
            <section id="properties-section" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {activeSearch ? `Search Results for "${activeSearch}"` : 'Explore All Properties'}
                        </h2>
                        <div className="w-20 h-1 bg-primary-500 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {approvedProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        {page < totalPages && (
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoading}
                                className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-full hover:border-primary-500 hover:text-primary-600 transition-all duration-300 shadow-sm hover:shadow-lg disabled:opacity-50"
                            >
                                {isLoading ? 'Loading...' : 'Load More Properties'}
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
