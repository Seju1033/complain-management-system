import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import fetchWithAuth from '../api.js';

const ComplaintDetailsModal = ({ isOpen, onRequestClose, complaint, onUpdateComplaint, onAddReply }) => {
    const [newStatus, setNewStatus] = useState(complaint?.status || '');
    const [assignedTo, setAssignedTo] = useState(complaint?.assignedTo?._id || '');
    const [department, setDepartment] = useState(complaint?.department || '');
    const [replyText, setReplyText] = useState('');
    const [staffUsers, setStaffUsers] = useState([]); 
    const [loadingStaff, setLoadingStaff] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setNewStatus(complaint?.status || '');
            setAssignedTo(complaint?.assignedTo?._id || '');
            setDepartment(complaint?.department || '');
            setReplyText(''); 
            fetchStaffUsers();
        }
    }, [isOpen, complaint]);

    const fetchStaffUsers = async () => {
        setLoadingStaff(true);
        try {
            
            const users = await fetchWithAuth('/admin/users');
           
            setStaffUsers(users.filter(u => u.role === 'admin' || u.role === 'employee'));
        } catch (err) {
            console.error('Failed to fetch staff users:', err);
            setError('Failed to load assignable users.');
        } finally {
            setLoadingStaff(false);
        }
    };

    const handleStatusUpdate = async () => {
        setError('');
        try {
            await fetchWithAuth(`/admin/complaints/${complaint._id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: newStatus }),
            });
            onUpdateComplaint(); 
        } catch (err) {
            setError(err.message || 'Failed to update status');
        }
    };

    const handleAssignmentUpdate = async () => {
        setError('');
        try {
            await fetchWithAuth(`/admin/complaints/${complaint._id}/assign`, {
                method: 'PUT',
                body: JSON.stringify({ assignedTo, department }),
            });
            onUpdateComplaint(); 
        } catch (err) {
            setError(err.message || 'Failed to update assignment');
        }
    };

    const handleAddReply = async () => {
        setError('');
        if (!replyText.trim()) {
            setError('Reply text cannot be empty.');
            return;
        }
        try {
            await fetchWithAuth(`/admin/complaints/${complaint._id}/reply`, {
                method: 'POST',
                body: JSON.stringify({ replyText }),
            });
            setReplyText('');
            onAddReply(); 
        } catch (err) {
            setError(err.message || 'Failed to add reply');
        }
    };

    if (!complaint) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Complaint Details"
            className="modal-content p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-10 relative overflow-y-auto"
            overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Complaint Details</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
                <div>
                    <p className="font-semibold">Complaint ID:</p>
                    <p>{complaint._id}</p>
                </div>
                <div>
                    <p className="font-semibold">Submitted By:</p>
                    <p>{complaint.user?.name} ({complaint.user?.email})</p>
                </div>
                <div>
                    <p className="font-semibold">Title:</p>
                    <p>{complaint.title}</p>
                </div>
                <div>
                    <p className="font-semibold">Category:</p>
                    <p>{complaint.category}</p>
                </div>
                <div>
                    <p className="font-semibold">Current Status:</p>
                    <p className={`font-bold ${
                        complaint.status === 'Resolved' ? 'text-green-600' :
                        complaint.status === 'In Progress' ? 'text-blue-600' :
                        complaint.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                        {complaint.status}
                    </p>
                </div>
                <div>
                    <p className="font-semibold">Priority:</p>
                    <p>{complaint.priority}</p>
                </div>
                <div>
                    <p className="font-semibold">Assigned To:</p>
                    <p>{complaint.assignedTo ? `${complaint.assignedTo.name} (${complaint.assignedTo.email})` : 'Not assigned'}</p>
                </div>
                <div>
                    <p className="font-semibold">Department:</p>
                    <p>{complaint.department || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-semibold">Submitted On:</p>
                    <p>{new Date(complaint.createdAt).toLocaleString()}</p>
                </div>
            </div>

            <div className="mb-6">
                <p className="font-semibold text-gray-800 mb-2">Description:</p>
                <p className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-800">{complaint.description}</p>
            </div>

            {/* Status Update */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Update Status</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
                    <div className="flex-grow w-full sm:w-auto">
                        <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                        <select
                            id="status-select"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                        >
                            {['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'].map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleStatusUpdate}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 w-full sm:w-auto"
                    >
                        Update Status
                    </button>
                </div>
            </div>

            {/* Assign Complaint */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Assign Complaint</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                    <div>
                        <label htmlFor="assignedTo-select" className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                        {loadingStaff ? (
                            <p className="text-gray-500">Loading assignable users...</p>
                        ) : (
                            <select
                                id="assignedTo-select"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                            >
                                <option value="">Select User (Optional)</option>
                                {staffUsers.map(user => (
                                    <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div>
                        <label htmlFor="department-input" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                            type="text"
                            id="department-input"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                            placeholder="e.g., Maintenance"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        />
                    </div>
                    <div className="col-span-full flex justify-end">
                        <button
                            onClick={handleAssignmentUpdate}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Update Assignment
                        </button>
                    </div>
                </div>
            </div>

            {/* Admin Replies */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Admin Replies</h3>
                {complaint.adminReplies && complaint.adminReplies.length > 0 ? (
                    <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                        {complaint.adminReplies.map((reply, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">{reply.user?.name || 'Admin'}</span> on {new Date(reply.createdAt).toLocaleString()}
                                </p>
                                <p className="text-gray-800 mt-1">{reply.replyText}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No replies yet.</p>
                )}
                <div className="mt-4">
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Add a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <button
                        onClick={handleAddReply}
                        className="mt-3 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Add Reply
                    </button>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onRequestClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default ComplaintDetailsModal;