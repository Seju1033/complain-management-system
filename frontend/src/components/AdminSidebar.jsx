import React from 'react';
import { useAuth } from '../AuthContext.jsx';

const AdminSidebar = ({ onNavigate, activeTab }) => {
    const { logout } = useAuth();

    const navItems = [
        { id: 'dashboard', name: 'Dashboard' },
        { id: 'users', name: 'Manage Users' },
        { id: 'complaints', name: 'Manage Complaints' },
       
    ];

    return (
        <div className="w-64 bg-gray-800 text-white flex flex-col h-full rounded-tr-lg rounded-br-lg shadow-lg">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-3xl font-extrabold text-blue-400">ResolveEase</h1>
                <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onNavigate(item.id)}
                        className={`w-full text-left py-3 px-4 rounded-lg flex items-center space-x-3 transition duration-200 ease-in-out
                            ${activeTab === item.id
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                       
                        {item.id === 'dashboard' && <span className="text-xl">📊</span>}
                        {item.id === 'users' && <span className="text-xl">👥</span>}
                        {item.id === 'complaints' && <span className="text-xl">📝</span>}
                        {item.id === 'reports' && <span className="text-xl">📈</span>}
                        {item.id === 'settings' && <span className="text-xl">⚙️</span>}
                        <span className="font-medium">{item.name}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700">
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

export default AdminSidebar;