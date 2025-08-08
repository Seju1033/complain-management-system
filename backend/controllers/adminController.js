const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password'); // Don't send passwords
    res.json(users);
});


const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.department = req.body.department || user.department; 

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            department: updatedUser.department,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Prevent an admin from deleting another admin (unless it's a super-admin scenario)
        if (user.role === 'admin' && req.user._id.toString() !== user._id.toString()) {
            res.status(403);
            throw new Error('Cannot delete another admin account.');
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});



const getAllComplaints = asyncHandler(async (req, res) => {
    const { status, category, assignedTo, department } = req.query; // filtering

    let query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo; 
    if (department) query.department = department;

    const complaints = await Complaint.find(query)
        .populate('user', 'name email department') 
        .populate('assignedTo', 'name email') 
        .sort({ createdAt: -1 }); 

    res.json(complaints);
});


const getComplaintById = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id)
        .populate('user', 'name email department')
        .populate('assignedTo', 'name email')
        .populate('adminReplies.user', 'name'); 

    if (complaint) {
        res.json(complaint);
    } else {
        res.status(404);
        throw new Error('Complaint not found');
    }
});


const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        complaint.status = status || complaint.status;

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } else {
        res.status(404);
        throw new Error('Complaint not found');
    }
});

const assignComplaint = asyncHandler(async (req, res) => {
    const { assignedTo, department } = req.body; // assignedTo should be a User ID

    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        if (assignedTo) {
            // Optional: Validate if assignedTo ID belongs to a user with staff/admin role
            const staffUser = await User.findById(assignedTo);
            if (!staffUser || (staffUser.role !== 'admin' && staffUser.role !== 'employee')) { 
                res.status(400);
                throw new Error('Invalid user ID for assignment, or user is not assignable.');
            }
            complaint.assignedTo = assignedTo;
        }
        if (department) {
            complaint.department = department;
        }

        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } else {
        res.status(404);
        throw new Error('Complaint not found');
    }
});

const addAdminReply = asyncHandler(async (req, res) => {
    const { replyText } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (complaint) {
        const adminReply = {
            user: req.user._id, // The logged-in admin's ID
            replyText,
        };

        complaint.adminReplies.push(adminReply);
        await complaint.save();
        res.status(201).json({ message: 'Reply added successfully', complaint });
    } else {
        res.status(404);
        throw new Error('Complaint not found');
    }
});

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    assignComplaint,
    addAdminReply,
};