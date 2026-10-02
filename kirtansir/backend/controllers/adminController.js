const User = require('../models/User');
const Product = require('../models/Product');
const Shipment = require('../models/Shipment');

// @desc    Get all users (Staff and Supervisors)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const query = {
            role: { $ne: 'Admin' },
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        const users = await User.find(query)
            .select('-password')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await User.countDocuments(query);

        res.status(200).json({
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        
        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.deleteOne({ _id: user._id });
        res.status(200).json({ message: 'User removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Monitor Warehouse Data
// @route   GET /api/admin/warehouse-data
// @access  Private/Admin
const getWarehouseData = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const lowStockProducts = await Product.find({ quantity: { $lt: 20 } });
        const totalShipments = await Shipment.countDocuments();
        const pendingShipments = await Shipment.countDocuments({ status: 'Pending' });
        const deliveredShipments = await Shipment.countDocuments({ status: 'Delivered' });

        res.status(200).json({
            totalProducts,
            lowStockProducts,
            totalShipments,
            pendingShipments,
            deliveredShipments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate Operational Reports
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        const totalShipments = await Shipment.countDocuments();
        const incoming = await Shipment.countDocuments({ type: 'Incoming' });
        const outgoing = await Shipment.countDocuments({ type: 'Outgoing' });
        const pending = await Shipment.countDocuments({ status: 'Pending' });
        const delivered = await Shipment.countDocuments({ status: 'Delivered' });
        const totalProducts = await Product.countDocuments();
        const outOfStock = await Product.countDocuments({ quantity: 0 });

        res.status(200).json({
            shipments: { total: totalShipments, incoming, outgoing, pending, delivered },
            inventory: { totalProducts, outOfStock }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all records (products and shipments)
// @route   GET /api/admin/records
// @access  Private/Admin
const getRecords = async (req, res) => {
    try {
        const products = await Product.find({});
        const shipments = await Shipment.find({}).populate('productId', 'name sku').populate('handledBy', 'name');
        res.status(200).json({ products, shipments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, updateUser, deleteUser, getWarehouseData, getReports, getRecords, deleteProduct };
