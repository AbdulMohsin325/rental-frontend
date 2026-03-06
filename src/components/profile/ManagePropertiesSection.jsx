import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllProperties, updatePropertyActiveStatus } from '../../services/propertyStore';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import ManagePropertiesHeader from '../manage-properties/ManagePropertiesHeader';
import PropertyListingsTable from '../manage-properties/PropertyListingsTable';
import AddPropertyForm from '../manage-properties/AddPropertyForm';

const ManagePropertiesSection = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [images, setImages] = useState([]);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadError, setImageUploadError] = useState('');
    const [activeProperties, setActiveProperties] = useState([]);
    const [editingProperty, setEditingProperty] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'list') {
            fetchProperties(1);
        }
    }, [activeTab]);


    const fetchProperties = async (pageNum = page) => {
        setIsLoading(true);
        let response = await getAllProperties(pageNum, 10);

        if (response.status && response.data) {
            setActiveProperties(response.data);
            setPage(pageNum);
            setTotalPages(response.totalPages || Math.ceil((response.total || 0) / 10));
        } else {
            setActiveProperties([]);
        }
        setIsLoading(false);
    }

    const handleImageSelect = async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;
        if (images.length + files.length > 6) {
            window.toast && window.toast.error
                ? window.toast.error('You can only upload up to 6 images.')
                : alert('You can only upload up to 6 images.');
            return;
        }
        setIsUploadingImage(true);
        setImageUploadError('');
        try {
            const uploadPromises = files.map(file => uploadImageToCloudinary(file));
            const urls = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...urls]);
        } catch (error) {
            setImageUploadError(error.message || 'Failed to upload image(s).');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleImageRemove = (url) => {
        setImages(prev => prev.filter(img => img !== url));
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setImages(property.images || []);
        setActiveTab('add');
    };

    const handleCancel = () => {
        setEditingProperty(null);
        setImages([]);
        setActiveTab('list');
    };

    const handleToggleActive = async (property) => {
        const propertyId = property?.homeId || property?._id || property?.id;
        const newStatus = property.isActive === false ? true : false;

        try {
            // Optimistic update
            setActiveProperties(prev => prev.map(p =>
                (p.homeId === propertyId || p._id === propertyId || p.id === propertyId)
                    ? { ...p, isActive: newStatus }
                    : p
            ));

            const response = await updatePropertyActiveStatus(propertyId, newStatus);
            if (response.status) {
                toast.success(`Property ${newStatus ? 'activated' : 'deactivated'} successfully`);
            } else {
                toast.error(response.message || 'Failed to update status');
                // Revert on failure
                fetchProperties();
            }
        } catch (error) {
            toast.error(error.message || 'Error updating property status');
            fetchProperties();
        }
    };

    return (
        <>
            <ManagePropertiesHeader activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'list' ? (
                <div className="space-y-4">
                    <PropertyListingsTable properties={activeProperties} onEdit={handleEdit} onToggleActive={handleToggleActive} />

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-slate-700">
                                        Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                                    </p>
                                </div>
                                <div>
                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                        <button
                                            onClick={() => fetchProperties(page - 1)}
                                            disabled={page === 1 || isLoading}
                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <span aria-hidden="true">&larr; Previous</span>
                                        </button>
                                        <button
                                            onClick={() => fetchProperties(page + 1)}
                                            disabled={page === totalPages || isLoading}
                                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <span aria-hidden="true">Next &rarr;</span>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <AddPropertyForm
                    images={images}
                    isUploadingImage={isUploadingImage}
                    imageUploadError={imageUploadError}
                    onCancel={handleCancel}
                    onImageSelect={handleImageSelect}
                    onImageRemove={handleImageRemove}
                    onImagesChange={setImages}
                    editingProperty={editingProperty}
                />
            )}
        </>
    );
};

export default ManagePropertiesSection;
