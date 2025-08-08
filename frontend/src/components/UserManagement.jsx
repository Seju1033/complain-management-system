import React, { useState, useEffect } from 'react';
import fetchWithAuth from '../api.js';
import Modal from 'react-modal';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null); // User being edited
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchWithAuth('/admin/users');
            setUsers(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser({ ...user }); 
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;
        setError('');
        try {
            const data = await fetchWithAuth(`/admin/users/${editingUser._id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: editingUser.name,
                    email: editingUser.email,
                    role: editingUser.role,
                    department: editingUser.department,
                }),
            });
            setUsers(users.map((user) => (user._id === data._id ? data : user)));
            setEditingUser(null); // Close modal
        } catch (err) {
            setError(err.message || 'Failed to update user');
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        setError('');
        try {
            await fetchWithAuth(`/admin/users/${userToDelete._id}`, {
                method: 'DELETE',
            });
            setUsers(users.filter((user) => user._id !== userToDelete._id));
            setShowDeleteConfirm(false);
            setUserToDelete(null);
        } catch (err) {
            setError(err.message || 'Failed to delete user');
        }
    };

    if (loading) return <div className="text-center py-8">Loading users...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md h-full overflow-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>

            {users.length === 0 ? (
                <p className="text-gray-600">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Email</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Role</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Department</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-700">{user._id.substring(0, 8)}...</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.email}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{user.department || 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs mr-2 transition duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit User Modal */}
            <Modal
                isOpen={!!editingUser}
                onRequestClose={() => setEditingUser(null)}
                contentLabel="Edit User"
                className="modal-content p-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto my-20 relative"
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Edit User</h3>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                <form onSubmit={handleUpdateUser}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingUser?.name || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingUser?.email || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingUser?.department || ''}
                            onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
                        <select
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editingUser?.role || 'employee'}
                            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setEditingUser(null)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Update User
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteConfirm}
                onRequestClose={() => setShowDeleteConfirm(false)}
                contentLabel="Confirm Delete"
                className="modal-content p-6 bg-white rounded-lg shadow-xl max-w-sm mx-auto my-20 relative"
                overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
                <p className="mb-6">Are you sure you want to delete user "{userToDelete?.name}"?</p>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={confirmDeleteUser}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default UserManagement;