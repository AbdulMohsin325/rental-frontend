import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Home, ArrowRight, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';




const registerSchema = z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z
        .string()
        .trim()
        .regex(/^[0-9+\-()\s]{10,16}$/, 'Enter a valid phone number'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});



const RegisterPage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
        },
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (formData) => {
        try {
            console.log(formData);
            let res = await registerUser(formData);
            console.log(res);
            if (res.status) {
                toast.success('Account created successfully!');
                navigate('/login');
            }
            else {
                toast.error(res.error || 'Unable to create account. Please try again.');
            }
        } catch (error) {
            toast.error(error.message || 'Unable to create account. Please try again.');
        }
    };

    useEffect(() => {
        console.log(errors);

    }, [errors])

    const inputBaseClass =
        'block w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200';
    const getInputClass = (hasError) =>
        `${inputBaseClass} ${hasError ? 'border-red-300 focus:ring-red-400' : 'border-slate-200 focus:ring-primary-500'}`;

    return (
        <div className="min-h-screen flex bg-slate-50">
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

                    <h2 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h2>
                    <p className="text-slate-500 mb-8 text-lg">Join LuxeRentals and start managing your listings.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User size={20} className="text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    autoComplete="name"
                                    {...register('name')}
                                    className={getInputClass(Boolean(errors.name))}
                                    placeholder="Jane Doe"
                                />
                            </div>
                            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
                        </div>

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
                                    className={getInputClass(Boolean(errors.email))}
                                    placeholder="hello@example.com"
                                />
                            </div>
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone size={20} className="text-slate-400" />
                                </div>
                                <input
                                    type="tel"
                                    autoComplete="tel"
                                    {...register('phone')}
                                    className={getInputClass(Boolean(errors.phone))}
                                    placeholder="(123) 456-7890"
                                />
                            </div>
                            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('password')}
                                    className={getInputClass(Boolean(errors.password))}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/30 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:block relative w-1/2 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/90 z-10 mix-blend-multiply"></div>
                <img
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&auto=format&fit=crop&q=80"
                    alt="Modern rental property"
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
                        New Agent Onboarding
                    </div>
                    <h3 className="text-4xl font-bold leading-tight mb-4 drop-shadow-lg text-balance">
                        Start growing your property business today.
                    </h3>
                    <p className="text-lg text-white/80 font-light max-w-lg">
                        Create your account to publish listings, track leads, and manage your rental operations from one place.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
