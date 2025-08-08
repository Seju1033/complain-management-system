import React, { useState, useEffect } from 'react';
import fetchWithAuth from '../api.js';
import { useAuth } from '../AuthContext.jsx';

const UserProfile = () => {
    const { user, login } = useAuth(); // Get user from context, and login function to update context
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                department: user.department || '',
                password: '', 
                confirmPassword: '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        const updateData = {
            name: formData.name,
            email: formData.email,
            department: formData.department,
        };

        if (formData.password) { 
            updateData.password = formData.password;
        }

        try {
            const updatedUser = await fetchWithAuth('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(updateData),
            });
            login(updatedUser); // Update user in AuthContext and localStorage
            setSuccess('Profile updated successfully!');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); // Clear password fields
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="text-center py-8 text-gray-600">Please log in to view your profile.</div>;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md h-full overflow-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        value={formData.email}
                        readOnly // Email is typically not editable after registration
                    />
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                        type="text"
                        id="department"
                        name="department"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Department"
                        value={formData.department}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password (optional)</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Leave blank to keep current password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </form>
        </div>
    );
};

export default UserProfile;