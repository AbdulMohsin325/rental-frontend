import React, { useState, useEffect } from 'react';
import { getAllProperties } from '../../services/propertyStore';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import ManagePropertiesHeader from '../manage-properties/ManagePropertiesHeader';
import PropertyListingsTable from '../manage-properties/PropertyListingsTable';
import AddPropertyForm from '../manage-properties/AddPropertyForm';

const ManagePropertiesSection = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [imageUrl, setImageUrl] = useState('');
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadError, setImageUploadError] = useState('');
    const [activeProperties, setActiveProperties] = useState([]);

    useEffect(() => {
        if (activeTab === 'list') {
            setActiveProperties(getAllProperties());
        }
    }, [activeTab]);

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
        <>
            <ManagePropertiesHeader activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'list' ? (
                <PropertyListingsTable properties={activeProperties} onEdit={() => setActiveTab('add')} />
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
        </>
    );
};

export default ManagePropertiesSection;
