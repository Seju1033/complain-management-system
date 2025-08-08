const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');


const submitComplaint = asyncHandler(async (req, res) => {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
        res.status(400);
        throw new Error('Please enter all required fields: title, description, and category');
    }

    const complaint = await Complaint.create({
        user: req.user._id, // User ID from authenticated request
        title,
        description,
        category,
        priority: priority || 'Low', // Default priority if not provided
        // Status defaults to 'Pending' in schema
    });

    res.status(201).json(complaint);
});


const getMyComplaints = asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ user: req.user._id })
        .populate('user', 'name email') 
        .populate('assignedTo', 'name email') 
        .sort({ createdAt: -1 }); // Sort by newest first

    res.json(complaints);
});


const getComplaintById = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id)
        .populate('user', 'name email')
        .populate('assignedTo', 'name email')
        .populate('adminReplies.user', 'name'); 
    if (complaint) {
        // Ensure the complaint belongs to the logged-in user or is an admin viewing it
        if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
            res.status(401);
            throw new Error('Not authorized to view this complaint');
        }
        res.json(complaint);
    } else {
        res.status(404);
        throw new Error('Complaint not found');
    }
});

module.exports = {
    submitComplaint,
    getMyComplaints,
    getComplaintById,
};