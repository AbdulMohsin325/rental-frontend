import React from 'react';
import { Plus } from 'lucide-react';

const ManagePropertiesHeader = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Agent Dashboard</h1>
                <p className="text-slate-500 mt-1">Manage your luxury property portfolio</p>
            </div>

            <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                <button
                    onClick={() => onTabChange('list')}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === 'list' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    My Listings
                </button>
                <button
                    onClick={() => onTabChange('add')}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${activeTab === 'add' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Plus size={16} />
                    Add New
                </button>
            </div>
        </div>
    );
};

export default ManagePropertiesHeader;
