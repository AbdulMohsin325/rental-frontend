import React from 'react';
import { Home, DollarSign, MapPin, Image as ImageIcon } from 'lucide-react';

const AddPropertyForm = ({
    imageUrl,
    selectedImageFile,
    isUploadingImage,
    imageUploadError,
    onCancel,
    onImageSelect,
    onImageUrlChange
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-10 max-w-4xl animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">Add New Property Listing</h2>

            <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Property Title</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Home size={18} className="text-slate-400" />
                            </div>
                            <input type="text" placeholder="e.g. Modern Glass Villa in Hollywood Hills" className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <MapPin size={18} className="text-slate-400" />
                            </div>
                            <input type="text" placeholder="e.g. Los Angeles, CA" className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Rent</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <DollarSign size={18} className="text-slate-400" />
                            </div>
                            <input type="number" placeholder="5000" className="block w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 md:col-span-2">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Bedrooms</label>
                            <input type="number" placeholder="3" className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Bathrooms</label>
                            <input type="number" placeholder="2.5" step="0.5" className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Square Feet</label>
                            <input type="number" placeholder="2500" className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea rows="4" placeholder="Describe the property details, neighborhood, and unique features..." className="block w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-y"></textarea>
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
                        <div className="relative">
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
                    <button type="button" className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-0.5">
                        Publish Listing
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPropertyForm;
