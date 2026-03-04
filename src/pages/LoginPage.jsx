import React from 'react';
import { Mail, Lock, Home, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});
const LoginPage = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data) => {
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success('Successfully logged in!');
            navigate('/manage');
        } catch (error) {
            toast.error('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">

            {/* Left Column - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
                <div className="w-full max-w-md animate-fade-in">

                    <div className="mb-10 block lg:hidden">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                                <Home size={24} />
                            </div>
                            <span className="text-xl font-bold text-gradient">LuxeRentals</span>
                        </Link>
                    </div>

                    <h2 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                    <p className="text-slate-500 mb-8 text-lg">Sign in to manage your luxury property listings.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    {...register('email')}
                                    className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-primary-500'}`}
                                    placeholder="hello@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    {...register('password')}
                                    className={`block w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-primary-500'}`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                                Remember me for 30 days
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Column - Image */}
            <div className="hidden lg:block relative w-1/2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10 mix-blend-multiply"></div>
                <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1627329598282-3e74dd566580?w=1200&auto=format&fit=crop&q=80"
                    alt="Luxury living space"
                />

                <div className="absolute top-12 left-12 z-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                            <Home size={28} />
                        </div>
                        <span className="text-2xl font-bold text-white drop-shadow-md">LuxeRentals</span>
                    </Link>
                </div>

                <div className="absolute bottom-16 left-16 right-16 z-20 text-white animate-slide-up">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium border border-white/30 mb-6">
                        Agent Portal
                    </div>
                    <h3 className="text-4xl font-bold leading-tight mb-4 drop-shadow-lg text-balance">
                        Manage your premium properties with ease.
                    </h3>
                    <p className="text-lg text-white/80 font-light max-w-lg mb-8">
                        Access your dashboard to track listings, manage inquiries, and oversee your entire luxury portfolio in one beautiful interface.
                    </p>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-4">
                            <img className="w-12 h-12 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop" alt="User" />
                            <img className="w-12 h-12 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" alt="User" />
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center font-bold">+2k</div>
                        </div>
                        <div className="text-sm font-medium">
                            Trusted by 2,000+ top agents
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;
