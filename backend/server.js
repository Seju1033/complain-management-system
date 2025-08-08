const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
// CORRECTED: Import notFound and errorHandler from authMiddleware
const { notFound, errorHandler } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Enable CORS for all origins (for development)
app.use(cors());

// Body parser middleware to handle JSON data
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
    res.send('ResolveEase API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // For employee-specific actions
const adminRoutes = require('./routes/adminRoutes'); // For admin-specific actions

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
