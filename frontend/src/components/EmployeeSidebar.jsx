import React from 'react';
import { useAuth } from '../AuthContext.jsx';

const EmployeeSidebar = ({ onNavigate, activeTab }) => {
    const { logout } = useAuth();

    const navItems = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'submit-complaint', name: 'Submit Complaint' },
        { id: 'my-complaints', name: 'My Complaints' },
        { id: 'profile', name: 'My Profile' },
    ];

    return (
        <div className="w-64 bg-blue-800 text-white flex flex-col h-full rounded-tr-lg rounded-br-lg shadow-lg">
            <div className="p-6 border-b border-blue-700">
                <h1 className="text-3xl font-extrabold text-blue-300">ResolveEase</h1>
                <p className="text-sm text-blue-200 mt-1">Employee Panel</p>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-200 ease-in-out
                            ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                            }`}
                    >
                       
                        {item.id === 'dashboard' && <span className="text-xl">🏠</span>}
                        {item.id === 'submit-complaint' && <span className="text-xl">➕</span>}
                        {item.id === 'my-complaints' && <span className="text-xl">📜</span>}
                        {item.id === 'profile' && <span className="text-xl">👤</span>}
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-blue-700">
                <button
                    onClick={logout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    <span className="text-xl">➡️</span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default EmployeeSidebar;