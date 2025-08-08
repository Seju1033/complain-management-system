import React, { useState, useEffect } from 'react';
import fetchWithAuth from '../api.js';
import Modal from 'react-modal'; // Assuming you'll use a modal for details

const MyComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchMyComplaints();
    }, []);

    const fetchMyComplaints = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await fetchWithAuth('/users/mycomplaints');
            setComplaints(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedComplaint(null);
    };

    if (loading) return <div className="text-center py-8">Loading your complaints...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md h-full overflow-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Complaints</h2>

            {complaints.length === 0 ? (
                <p className="text-gray-600">You have not submitted any complaints yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Title</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Priority</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Assigned To</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Submitted On</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint) => (
                                <tr key={complaint._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm text-gray-700">{complaint._id.substring(0, 8)}...</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{complaint.title}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{complaint.category}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                            complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            complaint.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${complaint.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                                            complaint.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                                            complaint.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {complaint.priority}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {complaint.assignedTo ? complaint.assignedTo.name : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {new Date(complaint.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4 text-sm">
                                        <button
                                            onClick={() => handleViewDetails(complaint)}
                                            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs transition duration-200"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Complaint Details Modal (reusing the admin's modal for viewing) */}
            {selectedComplaint && (
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={handleModalClose}
                    contentLabel="Complaint Details"
                    className="modal-content p-6 bg-white rounded-lg shadow-xl max-w-3xl mx-auto my-10 relative overflow-y-auto"
                    overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Complaint Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-gray-700">
                        <div><p className="font-semibold">Complaint ID:</p><p>{selectedComplaint._id}</p></div>
                        <div><p className="font-semibold">Submitted By:</p><p>{selectedComplaint.user?.name} ({selectedComplaint.user?.email})</p></div>
                        <div><p className="font-semibold">Title:</p><p>{selectedComplaint.title}</p></div>
                        <div><p className="font-semibold">Category:</p><p>{selectedComplaint.category}</p></div>
                        <div><p className="font-semibold">Current Status:</p><p className={`font-bold ${
                            selectedComplaint.status === 'Resolved' ? 'text-green-600' :
                            selectedComplaint.status === 'In Progress' ? 'text-blue-600' :
                            selectedComplaint.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                        }`}>{selectedComplaint.status}</p></div>
                        <div><p className="font-semibold">Priority:</p><p>{selectedComplaint.priority}</p></div>
                        <div><p className="font-semibold">Assigned To:</p><p>{selectedComplaint.assignedTo ? selectedComplaint.assignedTo.name : 'Not assigned'}</p></div>
                        <div><p className="font-semibold">Department:</p><p>{selectedComplaint.department || 'N/A'}</p></div>
                        <div><p className="font-semibold">Submitted On:</p><p>{new Date(selectedComplaint.createdAt).toLocaleString()}</p></div>
                    </div>
                    <div className="mb-6">
                        <p className="font-semibold text-gray-800 mb-2">Description:</p>
                        <p className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-800">{selectedComplaint.description}</p>
                    </div>

                    {/* Admin Replies Section */}
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Replies from Admin/Staff</h3>
                        {selectedComplaint.adminReplies && selectedComplaint.adminReplies.length > 0 ? (
                            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                                {selectedComplaint.adminReplies.map((reply, index) => (
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
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleModalClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MyComplaints;