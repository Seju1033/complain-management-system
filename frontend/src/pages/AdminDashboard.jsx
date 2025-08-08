import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import UserManagement from '../components/UserManagement.jsx';
import ComplaintManagement from '../components/ComplaintManagement.jsx';
import { useAuth } from '../AuthContext.jsx';
import '../App.css'

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // Default tab
    const { user } = useAuth();

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="p-6 bg-white rounded-lg shadow-md h-full flex flex-col items-center justify-center text-center">
                        <h2 className="text-3xl font-bold text-gray-700 mb-4">Welcome, {user?.name || 'Admin'}!</h2>
                        <p className="text-gray-600 text-lg">Your Admin Panel for ResolveEase.</p>
                        <p className="text-gray-500 mt-2">Manage users and complaints efficiently from here.</p>
                    </div>
                );
            case 'users':
                return <UserManagement />;
            case 'complaints':
                return <ComplaintManagement />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-inter">
            <AdminSidebar onNavigate={setActiveTab} activeTab={activeTab} />
            <main className="flex-1 p-6 overflow-hidden">
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminDashboard;