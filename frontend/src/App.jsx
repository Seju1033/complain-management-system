import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import './App.css'


const App = () => {
    const [currentPage, setCurrentPage] = useState('login'); // 'login', 'register', 'employeeDashboard', 'adminDashboard'
    const { user, isAdmin, loadingAuth } = useAuth();

    useEffect(() => {
        if (!loadingAuth) {
            if (user) {
                if (isAdmin) {
                    setCurrentPage('adminDashboard');
                } else {
                    setCurrentPage('employeeDashboard');
                }
            } else {
                setCurrentPage('login');
            }
        }
    }, [user, isAdmin, loadingAuth]);

    const handleLoginSuccess = () => {
        // This will trigger the useEffect above to set the correct dashboard
    };

    const handleRegisterSuccess = () => {
        setCurrentPage('login'); 
    };

    if (loadingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 font-inter">
                <div className="text-xl text-gray-700">Loading application...</div>
            </div>
        );
    }

    // Simple routing based on currentPage state
    switch (currentPage) {
        case 'login':
            return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
        case 'register':
            return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onNavigateToLogin={() => setCurrentPage('login')} />;
        case 'employeeDashboard':
            return user && !isAdmin ? <EmployeeDashboard /> : <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
        case 'adminDashboard':
            return user && isAdmin ? <AdminDashboard /> : <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
        default:
            return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setCurrentPage('register')} />;
    }
};

export default App;