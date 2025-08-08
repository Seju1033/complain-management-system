import React, { useState, useEffect } from 'react';
import fetchWithAuth from '../api.js';
import ComplaintDetailsModal from './ComplaintDetailsModal.jsx';

const ComplaintManagement = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter states
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('');

    useEffect(() => {
        fetchComplaints();
    }, [filterStatus, filterCategory, filterDepartment]); // Re-fetch when filters change

    const fetchComplaints = async () => {
        setLoading(true);
        setError('');
        try {
            const queryParams = new URLSearchParams();
            if (filterStatus) queryParams.append('status', filterStatus);
            if (filterCategory) queryParams.append('category', filterCategory);
            if (filterDepartment) queryParams.append('department', filterDepartment);

            const data = await fetchWithAuth(`/admin/complaints?${queryParams.toString()}`);
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

    // Callback to re-fetch complaints after an update in the modal
    const handleComplaintUpdated = () => {
        fetchComplaints();
        
        if (selectedComplaint) {
            fetchWithAuth(`/admin/complaints/${selectedComplaint._id}`)
                .then(data => setSelectedComplaint(data))
                .catch(err => console.error("Failed to re-fetch selected complaint details:", err));
        }
    };

    if (loading) return <div className="text-center py-8">Loading complaints...</div>;
    if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md h-full overflow-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Complaints</h2>

            {/* Filters */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                    <select
                        id="filter-status"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        {['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-category" className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
                    <input
                        type="text"
                        id="filter-category"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                        placeholder="e.g., IT, HR"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="filter-department" className="block text-sm font-medium text-gray-700 mb-1">Filter by Department</label>
                    <input
                        type="text"
                        id="filter-department"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3"
                        placeholder="e.g., Maintenance"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                    />
                </div>
            </div>

            {complaints.length === 0 ? (
                <p className="text-gray-600">No complaints found matching your criteria.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Title</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Assigned To</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Department</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Submitted By</th>
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
                                        {complaint.assignedTo ? complaint.assignedTo.name : 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {complaint.department || 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {complaint.user?.name || 'Unknown User'}
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

            {/* Complaint Details Modal */}
            {selectedComplaint && (
                <ComplaintDetailsModal
                    isOpen={isModalOpen}
                    onRequestClose={handleModalClose}
                    complaint={selectedComplaint}
                    onUpdateComplaint={handleComplaintUpdated}
                    onAddReply={handleComplaintUpdated} // Re-fetch details after adding reply
                />
            )}
        </div>
    );
};

export default ComplaintManagement;