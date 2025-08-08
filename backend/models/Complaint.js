const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    category: { 
        type: String,
        required: true,
    },
    status: { 
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
        default: 'Pending',
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Low',
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null, 
    },
    department: { 
        type: String,
        required: false,
    },
    adminReplies: [ 
        {
            user: { 
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            replyText: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
   
}, { timestamps: true }); 

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;