import React, { useState, useEffect, useRef } from 'react';
import { getProperties, updatePropertyStatus } from '../services/propertyStore';
import { CheckCircle, XCircle, ShieldAlert, Users, UserCog, UserPlus, User, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutUser, getIsAdmin } from '../services/auth';
import toast from 'react-hot-toast';
import { fetchAllUsers, fetchAdminUsers, createAdminUser, updateUserById } from '../services/user';
import { useUser } from '../context/UserContext';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('properties');
    const [properties, setProperties] = useState([]);
    const [propertiesPage, setPropertiesPage] = useState(1);
    const [propertiesTotalPages, setPropertiesTotalPages] = useState(1);
    const [isLoadingProperties, setIsLoadingProperties] = useState(false);

    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSavingUser, setIsSavingUser] = useState(false);
    const navigate = useNavigate();
    const { userDetails, clearUserDetails } = useUser();
    const isAdmin = getIsAdmin();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const loadProperties = async (pageNum = propertiesPage) => {
        setIsLoadingProperties(true);
        const response = await getProperties(pageNum, 10);
        if (response.status && response.data) {
            setProperties(response.data);
            setPropertiesPage(pageNum);
            setPropertiesTotalPages(response.totalPages || Math.ceil((response.total || 0) / 10));
        } else {
            setProperties([]);
        }
        setIsLoadingProperties(false);
    };

    useEffect(() => {
        if (activeTab === 'properties') {
            loadProperties(1);
        }
    }, [activeTab]);

    const loadUsers = async (mode) => {
        try {
            setIsLoadingUsers(true);
            const loader = mode === 'admins' ? fetchAdminUsers : fetchAllUsers;
            const res = await loader();
            if (res.status) {
                setUsers(res.data || []);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to load users');
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await updatePropertyStatus(id, 'Approved');
            if (res.status) {
                toast.success(res.message);
                await loadProperties();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to approve property.');
        }
    };

    const handleReject = async (id) => {
        try {
            const res = await updatePropertyStatus(id, 'Rejected');
            if (res.status) {
                toast.error(res.message || 'Property rejected.');
                await loadProperties();
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            toast.error('Failed to reject property.');
        }
    };

    const handleLogout = async () => {
        const res = await logoutUser();
        clearUserDetails();
        setIsMenuOpen(false);
        if (res.status) {
            toast.success(res.message || 'Logged out of Admin Portal');
            navigate('/admin/login');
        } else {
            toast.error(res.message || 'Failed to logout. Please try again.');
        }
    };



    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleUserFieldChange = (event) => {
        const { name, value } = event.target;
        setSelectedUser((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleSaveUser = async (event) => {
        event.preventDefault();
        if (!selectedUser?.id) return;

        try {
            setIsSavingUser(true);
            const { id, fullName, email, phone, role } = selectedUser;
            const res = await updateUserById(id, { name: fullName, email, phone, role });
            if (res.status) {
                toast.success(res.message || 'User updated');
                // refresh list based on tab
                await loadUsers(activeTab === 'admin-users' ? 'admins' : 'all');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to update user');
        } finally {
            setIsSavingUser(false);
        }
    };

    const handleCreateAdmin = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            name: formData.get('name')?.toString() || '',
            email: formData.get('email')?.toString() || '',
            phone: formData.get('phone')?.toString() || '',
            password: formData.get('password')?.toString() || '',
        };

        if (!payload.name || !payload.email || !payload.password) {
            toast.error('Name, email and password are required');
            return;
        }

        try {
            setIsSavingUser(true);
            const res = await createAdminUser(payload);
            if (res.status) {
                toast.success(res.message || 'Admin created');
                event.currentTarget.reset();
                await loadUsers('admins');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create admin');
        } finally {
            setIsSavingUser(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className="min-h-screen bg-slate-100 pt-8 pb-12 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>
                {/* Header Section */}
                <div className="flex justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                            <ShieldAlert size={24} className="text-primary-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Platform Administration</h1>
                            <p className="text-sm text-slate-500">Manage properties and platform users.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-slate-900">
                                {userDetails?.fullName || 'System Admin'}
                            </p>
                            <p className="text-xs text-slate-500">
                                {isAdmin ? 'Full access' : 'Signed in'}
                            </p>
                        </div>

                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(open => !open)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-white bg-slate-900 hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <User size={16} />
                                <span className="hidden sm:inline">
                                    {userDetails?.fullName || 'Account'}
                                </span>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-lg border border-slate-100 py-2 text-sm">
                                    <div className="px-4 pb-2 border-b border-slate-100">
                                        <p className="font-semibold text-slate-900 truncate">
                                            {userDetails?.fullName || 'Signed in'}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {userDetails?.email}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigate('/profile');
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                                    >
                                        Profile
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="inline-flex rounded-full bg-white shadow-sm border border-slate-200 p-1">
                        <button
                            onClick={() => setActiveTab('properties')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'properties' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            <ShieldAlert size={16} />
                            Properties
                        </button>
                        <button
                            onClick={async () => {
                                setActiveTab('admin-users');
                                await loadUsers('admins');
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'admin-users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            <UserCog size={16} />
                            Admin users
                        </button>
                        <button
                            onClick={async () => {
                                setActiveTab('users');
                                await loadUsers('all');
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors ${activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            <Users size={16} />
                            All users
                        </button>
                    </div>
                </div>

                {activeTab === 'properties' && (
                    <>
                        {/* Dashboard Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
                                <p className="text-sm font-medium text-slate-500 mb-1">Total Properties</p>
                                <h3 className="text-3xl font-bold text-slate-900">{properties.length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-green-500">
                                <p className="text-sm font-medium text-slate-500 mb-1">Active / Approved</p>
                                <h3 className="text-3xl font-bold text-slate-900">{properties.filter(p => p.approvalStatus === 'Approved').length}</h3>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-yellow-500">
                                <p className="text-sm font-medium text-slate-500 mb-1">Pending Approval</p>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    {properties.filter(p => p.approvalStatus === 'Pending').length > 0 ? (
                                        <span className="flex items-center gap-2">
                                            {properties.filter(p => p.approvalStatus === 'Pending').length}
                                            <span className="inline-flex h-3 w-3 rounded-full bg-yellow-400 animate-pulse"></span>
                                        </span>
                                    ) : 0}
                                </h3>
                            </div>
                        </div>

                        {/* Properties Table */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    Property Directory
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                            <th className="p-4 font-semibold">ID / Listing</th>
                                            <th className="p-4 font-semibold">Owner</th>
                                            <th className="p-4 font-semibold">Location</th>
                                            <th className="p-4 font-semibold">Price</th>
                                            <th className="p-4 font-semibold">Status</th>
                                            <th className="p-4 font-semibold text-right">Admin Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {properties.map((property) => (
                                            <tr key={property.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <img src={property.thumbnail} alt={property.title} className="w-12 h-12 rounded-lg object-cover shadow-sm border border-slate-200" />
                                                        <div>
                                                            <div className="text-xs text-slate-400 mb-0.5">#{property.homeId}</div>
                                                            <div className="font-semibold text-slate-900">{property.title}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-slate-600">{property.owner}</td>
                                                <td className="p-4 text-sm text-slate-600">{property.city}</td>
                                                <td className="p-4 text-sm font-bold text-slate-900">
                                                    ${property.price.toLocaleString()}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${property.approvalStatus === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-200/50'
                                                        : property.approvalStatus === 'Rejected'
                                                            ? 'bg-red-100 text-red-700 border border-red-200/50'
                                                            : 'bg-green-100 text-green-700 border border-green-200/50'
                                                        }`}>
                                                        {property.approvalStatus === 'Pending' ? 'Pending' : property.approvalStatus === 'Rejected' ? 'Rejected' : 'Approved'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 text-slate-400">
                                                        {property.approvalStatus === 'Pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(property.homeId)}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-semibold transition-colors border border-green-200/50"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(property.homeId)}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-semibold transition-colors border border-red-200/50"
                                                                >
                                                                    <XCircle size={16} />
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        {property.status === 'approved' && (
                                                            <span className="text-xs text-slate-400 px-3 py-1.5 flex items-center gap-1">
                                                                <CheckCircle size={14} className="text-green-500" /> Confirmed
                                                            </span>
                                                        )}
                                                        {property.status === 'rejected' && (
                                                            <span className="text-xs text-slate-400 px-3 py-1.5 flex items-center gap-1">
                                                                <XCircle size={14} className="text-red-500" /> Rejected
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {properties.length === 0 && !isLoadingProperties && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                                    No properties found in the system.
                                                </td>
                                            </tr>
                                        )}
                                        {isLoadingProperties && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500">
                                                    Loading properties...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {propertiesTotalPages > 1 && (
                                <div className="flex items-center justify-between bg-slate-50 px-6 py-4 border-t border-slate-100">
                                    <div className="flex flex-1 items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-700">
                                                Page <span className="font-semibold">{propertiesPage}</span> of <span className="font-semibold">{propertiesTotalPages}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                <button
                                                    onClick={() => loadProperties(propertiesPage - 1)}
                                                    disabled={propertiesPage === 1 || isLoadingProperties}
                                                    className="relative inline-flex items-center rounded-l-md px-3 py-2 text-slate-400 bg-white ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Previous</span>
                                                    <span aria-hidden="true" className="text-sm font-medium">&larr; Previous</span>
                                                </button>
                                                <button
                                                    onClick={() => loadProperties(propertiesPage + 1)}
                                                    disabled={propertiesPage === propertiesTotalPages || isLoadingProperties}
                                                    className="relative inline-flex items-center rounded-r-md px-3 py-2 text-slate-400 bg-white ring-1 ring-inset ring-slate-300 hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    <span className="sr-only">Next</span>
                                                    <span aria-hidden="true" className="text-sm font-medium">Next &rarr;</span>
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'admin-users' && (
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1.3fr] gap-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <UserCog size={18} />
                                    Admin users
                                </h2>
                                {isLoadingUsers && <span className="text-xs text-slate-500">Loading…</span>}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                            <th className="p-4 font-semibold">Name</th>
                                            <th className="p-4 font-semibold">Email</th>
                                            <th className="p-4 font-semibold">Phone</th>
                                            <th className="p-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map((user) => (
                                            <tr key={user.id || user._id || user.email} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4 text-sm font-medium text-slate-900">{user.fullName}</td>
                                                <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                                <td className="p-4 text-sm text-slate-600">{user.phone}</td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectUser(user)}
                                                        className="text-xs font-semibold text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                                                    >
                                                        View / edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {!isLoadingUsers && users.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="p-8 text-center text-slate-500 text-sm">
                                                    No admin users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                <h3 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
                                    <UserPlus size={16} />
                                    Create admin user
                                </h3>
                                <p className="text-xs text-slate-500 mb-4">
                                    Creates a new user with admin permissions.
                                </p>
                                <form onSubmit={handleCreateAdmin} className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Full name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="Jane Admin"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="admin@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Phone (optional)</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="+1 555 000 0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                                        <input
                                            name="password"
                                            type="password"
                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSavingUser}
                                        className="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
                                    >
                                        {isSavingUser ? 'Creating…' : 'Create admin'}
                                    </button>
                                </form>
                            </div>

                            {selectedUser && (
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-base font-semibold text-slate-900 mb-1">Edit user</h3>
                                    <p className="text-xs text-slate-500 mb-4">
                                        Update basic details and role.
                                    </p>
                                    <form onSubmit={handleSaveUser} className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Full name</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={selectedUser.fullName || ''}
                                                onChange={handleUserFieldChange}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={selectedUser.email || ''}
                                                onChange={handleUserFieldChange}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={selectedUser.phone || ''}
                                                onChange={handleUserFieldChange}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
                                            <select
                                                name="role"
                                                value={selectedUser.role || 'user'}
                                                onChange={handleUserFieldChange}
                                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                        <div className="pt-2 flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedUser(null)}
                                                className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSavingUser}
                                                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 disabled:opacity-60"
                                            >
                                                {isSavingUser ? 'Saving…' : 'Save changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Users size={18} />
                                All users
                            </h2>
                            {isLoadingUsers && <span className="text-xs text-slate-500">Loading…</span>}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Name</th>
                                        <th className="p-4 font-semibold">Email</th>
                                        <th className="p-4 font-semibold">Phone</th>
                                        <th className="p-4 font-semibold">Role</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((user) => (
                                        <tr key={user.id || user._id || user.email} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4 text-sm font-medium text-slate-900">{user.fullName}</td>
                                            <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                            <td className="p-4 text-sm text-slate-600">{user.phone}</td>
                                            <td className="p-4 text-xs">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full border text-[11px] font-semibold ${user.role === 'admin'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                                    }`}>
                                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectUser(user)}
                                                    className="text-xs font-semibold text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                                                >
                                                    View / edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {!isLoadingUsers && users.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500 text-sm">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
