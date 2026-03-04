import React, { useState } from 'react';
import { properties } from '../data/mockData';
import { uploadImageToCloudinary } from '../services/cloudinary';
import ManagePropertiesHeader from '../components/manage-properties/ManagePropertiesHeader';
import PropertyListingsTable from '../components/manage-properties/PropertyListingsTable';
import AddPropertyForm from '../components/manage-properties/AddPropertyForm';

const ManageProperties = () => {
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'add'
    const [imageUrl, setImageUrl] = useState('');
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadError, setImageUploadError] = useState('');

    const handleImageSelect = async (event) => {
        const [file] = event.target.files || [];
        setSelectedImageFile(file || null);
        setImageUploadError('');

        if (!file) {
            return;
        }

        try {
            setIsUploadingImage(true);
            setImageUploadError('');
            const uploadedImageUrl = await uploadImageToCloudinary(file);
            setImageUrl(uploadedImageUrl);
        } catch (error) {
            setImageUploadError(error.message || 'Failed to upload image.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ManagePropertiesHeader activeTab={activeTab} onTabChange={setActiveTab} />

                {activeTab === 'list' ? (
                    <PropertyListingsTable properties={properties} onEdit={() => setActiveTab('add')} />
                ) : (
                    <AddPropertyForm
                        imageUrl={imageUrl}
                        selectedImageFile={selectedImageFile}
                        isUploadingImage={isUploadingImage}
                        imageUploadError={imageUploadError}
                        onCancel={() => setActiveTab('list')}
                        onImageSelect={handleImageSelect}
                        onImageUrlChange={setImageUrl}
                    />
                )}
            </div>
        </div>
    );
};

export default ManageProperties;
