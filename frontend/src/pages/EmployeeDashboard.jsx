import React, { useState } from 'react';
import EmployeeSidebar from '../components/EmployeeSidebar.jsx';
import SubmitComplaint from '../components/SubmitComplaint.jsx';
import MyComplaints from '../components/MyComplaints.jsx';
import UserProfile from '../components/UserProfile.jsx';
import { useAuth } from '../AuthContext.jsx';

const EmployeeDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // Default tab
    const { user } = useAuth();

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="p-6 bg-white rounded-lg shadow-md h-full flex flex-col items-center justify-center text-center">
                        <h2 className="text-3xl font-bold text-gray-700 mb-4">Welcome, {user?.name || 'Employee'}!</h2>
                        <p className="text-gray-600 text-lg">Your Employee Dashboard for ResolveEase.</p>
                        <p className="text-gray-500 mt-2">Use the sidebar to submit new complaints, view your existing ones, or update your profile.</p>
                    </div>
                );
            case 'submit-complaint':
                return <SubmitComplaint />;
            case 'my-complaints':
                return <MyComplaints />;
            case 'profile':
                return <UserProfile />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-inter">
            <EmployeeSidebar onNavigate={setActiveTab} activeTab={activeTab} />
            <main className="flex-1 p-6 overflow-hidden">
                {renderContent()}
            </main>
        </div>
    );
};

export default EmployeeDashboard;