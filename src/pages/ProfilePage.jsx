import React, { useEffect, useState } from 'react';
import { UserCog, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ManagePropertiesSection from '../components/profile/ManagePropertiesSection';
import ManageBookingsSection from '../components/profile/ManageBookingsSection';
import { getMe, getUser, updateMe } from '../services/auth';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('bookings'); // Changed default to bookings
    const [profile, setProfile] = useState({ fullName: '', email: '', phone: '' });
    const [isUserLoading, setIsUserLoading] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

    useEffect(() => {
        const userDetails = getUser();
        if (userDetails) {
            setProfile({
                fullName: userDetails?.fullName || userDetails?.name || '',
                email: userDetails?.email || '',
                phone: userDetails?.phone || '',
            });
            return;
        }

        const fetchProfile = async () => {
            try {
                setIsUserLoading(true);
                const res = await getMe();
                if (res.status) {
                    setProfile({
                        fullName: res.data?.fullName || res.data?.name || '',
                        email: res.data?.email || '',
                        phone: res.data?.phone || '',
                    });
                }
            } catch (error) {
                toast.error(error?.message || 'Failed to load profile.');
            } finally {
                setIsUserLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = (event) => {
        event.preventDefault();
        const submitProfile = async () => {
            try {
                setIsSavingProfile(true);
                const res = await updateMe({
                    name: profile.fullName,
                    email: profile.email,
                    phone: profile.phone,
                });

                if (res.status) {
                    const nextProfile = {
                        fullName: res.data?.fullName || res.data?.name || profile.fullName,
                        email: res.data?.email || profile.email,
                        phone: res.data?.phone || profile.phone,
                    };
                    setProfile(nextProfile);
                    toast.success(res.message || 'Profile updated.');
                }
            } catch (error) {
                toast.error(error.message || 'Failed to update profile.');
            } finally {
                setIsSavingProfile(false);
            }
        };

        submitProfile();
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-8 inline-flex gap-2">
                    <button
                        onClick={() => setActiveSection('properties')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeSection === 'properties' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Building2 size={16} />
                        Manage Properties
                    </button>
                    <button
                        onClick={() => setActiveSection('bookings')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeSection === 'bookings' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                        Booking Enquiries
                    </button>
                    <button
                        onClick={() => setActiveSection('settings')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeSection === 'settings' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <UserCog size={16} />
                        Profile Settings
                    </button>
                </div>

                {activeSection === 'bookings' ? (
                    <ManageBookingsSection />
                ) : activeSection === 'properties' ? (
                    <ManagePropertiesSection />
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-3xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Settings</h2>
                        <p className="text-slate-500 mb-8">Update your profile details.</p>

                        <form onSubmit={handleSaveSettings} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleFieldChange}
                                    disabled={isUserLoading || isSavingProfile}
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Jane Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleFieldChange}
                                    disabled={isUserLoading || isSavingProfile}
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="hello@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleFieldChange}
                                    disabled={isUserLoading || isSavingProfile}
                                    className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="(123) 456-7890"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isUserLoading || isSavingProfile}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isSavingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
