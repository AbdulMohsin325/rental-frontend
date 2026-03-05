import React from 'react';
import { Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { adminLoginUser } from '../services/auth';
import { useUser } from '../context/UserContext';

const adminLoginSchema = z.object({
    email: z.string().email('Enter a valid admin email address'),
    password: z.string().min(1, 'Password is required'),
});

const AdminLoginPage = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(adminLoginSchema)
    });

    const { refreshUserDetails } = useUser();

    const onSubmit = async (data) => {
        try {
            let res = await adminLoginUser(data);
            if (res.status) {
                await refreshUserDetails();
                toast.success('Successfully logged in as Admin!');
                setTimeout(() => navigate('/admin/dashboard'), 100);
            } else {
                toast.error(res.error || 'Failed to log in. Please check your admin credentials.');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to log in. Please check your admin credentials.');
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900">

            {/* Left Column - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                <div className="w-full max-w-md animate-fade-in">

                    <div className="mb-10 block lg:hidden">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white shadow-lg">
                                <ShieldAlert size={24} className="text-primary-400" />
                            </div>
                            <span className="text-xl font-bold text-slate-900">Admin Portal</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="hidden lg:flex w-10 h-10 rounded-xl bg-slate-800 items-center justify-center text-white shadow-lg">
                            <ShieldAlert size={24} className="text-primary-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-slate-900">Admin Login</h2>
                    </div>
                    <p className="text-slate-500 mb-8 text-lg">Secure access for platform administrators.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    {...register('email')}
                                    className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-slate-800'}`}
                                    placeholder="admin@luxerentals.com"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    {...register('password')}
                                    className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-slate-800'}`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-slate-900/30 text-base font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Secure Sign In'}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center">
                        <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                            Return to Agent Login
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Column - Image */}
            <div className="hidden lg:block relative w-1/2 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
                    <img
                        className="w-full h-full object-cover grayscale"
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80"
                        alt="Corporate Office"
                    />
                </div>

                <div className="absolute top-12 left-12 z-20">
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="text-2xl font-bold text-white drop-shadow-md">LuxeRentals</span>
                    </Link>
                </div>

                <div className="absolute bottom-16 left-16 right-16 z-20 text-white animate-slide-up">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md text-sm font-medium border border-slate-700 mb-6 text-primary-400">
                        System Administration
                    </div>
                    <h3 className="text-4xl font-bold leading-tight mb-4 drop-shadow-lg text-balance">
                        Platform Management Console
                    </h3>
                    <p className="text-lg text-slate-300 font-light max-w-lg mb-8">
                        This portal is restricted to authorized personnel only. Ensure you are connected from an approved secure network.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default AdminLoginPage;
