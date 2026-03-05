import React from 'react';
import { Home, DollarSign, MapPin, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { addProperty } from '../../services/propertyStore';

const propertySchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    location: z.string().min(5, 'Location must be at least 5 characters'),
    price: z.coerce.number().positive('Price must be positive'),
    bedrooms: z.coerce.number().positive('Bedrooms must be positive'),
    bathrooms: z.coerce.number().positive('Bathrooms must be positive'),
    sqft: z.coerce.number().positive('Square feet must be positive'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
});

const AddPropertyForm = ({
    imageUrl,
    selectedImageFile,
    isUploadingImage,
    imageUploadError,
    onCancel,
    onImageSelect,
    onImageUrlChange
}) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(propertySchema)
    });

    const onSubmit = async (data) => {
        if (!imageUrl) {
            toast.error('Please provide an image for the property');
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Mock API delay
            const newPropertyData = {
                title: data.title,
                location: data.location,
                price: Number(data.price),
                bedrooms: Number(data.bedrooms),
                bathrooms: Number(data.bathrooms),
                sqft: Number(data.sqft),
                description: data.description,
                imageUrl: imageUrl,
                amenities: ["Newly Listed"] // Default mock amenity
            };

            addProperty(newPropertyData);
            toast.success('Property submitted for admin approval!');
            onCancel(); // Use existing prop convention to switch back to list
        } catch (error) {
            toast.error('Failed to publish property');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 max-w-4xl animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Add New Property Listing</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Property Title</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Home size={18} className="text-slate-400" />
                            </div>
                            <input type="text" {...register('title')} placeholder="e.g. Modern Glass Villa in Hollywood Hills" className={`block w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.title ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'}`} />
                        </div>
                        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MapPin size={18} className="text-slate-400" />
                            </div>
                            <input type="text" {...register('location')} placeholder="e.g. Los Angeles, CA" className={`block w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.location ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'}`} />
                        </div>
                        {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Rent</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <DollarSign size={18} className="text-slate-400" />
                            </div>
                            <input type="number" {...register('price')} placeholder="5000" className={`block w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.price ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'}`} />
                        </div>
                        {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Bedrooms</label>
                            <input type="number" {...register('bedrooms')} placeholder="3" className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.bedrooms ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'}`} />
                            {errors.bedrooms && <p className="mt-1 text-xs text-red-600">{errors.bedrooms.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Bathrooms</label>
                            <input type="number" {...register('bathrooms')} step="0.5" placeholder="2.5" className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.bathrooms ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'}`} />
                            {errors.bathrooms && <p className="mt-1 text-xs text-red-600">{errors.bathrooms.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Square Feet</label>
                            <input type="number" {...register('sqft')} placeholder="2500" className={`block w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${errors.sqft ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'}`} />
                            {errors.sqft && <p className="mt-1 text-xs text-red-600">{errors.sqft.message}</p>}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea rows="4" {...register('description')} placeholder="Describe the property details, neighborhood, and unique features..." className={`block w-full p-4 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-y ${errors.description ? 'border-red-300 focus:ring-red-400' : 'border-slate-200'}`}></textarea>
                        {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Main Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onImageSelect}
                            className="block w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-slate-200 file:text-slate-700 file:font-medium hover:file:bg-slate-300"
                        />
                        {selectedImageFile && (
                            <p className="text-sm text-slate-500 mt-2">
                                {isUploadingImage ? 'Uploading image to Cloudinary...' : `Selected: ${selectedImageFile.name}`}
                            </p>
                        )}
                        <div className="relative mt-2">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <ImageIcon size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(event) => onImageUrlChange(event.target.value)}
                                placeholder="https://images.unsplash.com/..."
                                className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        {imageUploadError && <p className="text-sm text-red-600 mt-2">{imageUploadError}</p>}
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Uploaded property preview"
                                className="mt-4 h-44 w-full sm:w-80 object-cover rounded-xl border border-slate-200"
                            />
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all">
                        Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPropertyForm;
