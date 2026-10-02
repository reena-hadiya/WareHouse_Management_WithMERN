const Product = require('../models/Product');
const Shipment = require('../models/Shipment');
const StorageLocation = require('../models/StorageLocation');

// @desc    Monitor Warehouse Operations
// @route   GET /api/supervisor/operations
// @access  Private/Supervisor
const getOperations = async (req, res) => {
    try {
        const incoming = await Shipment.find({ type: 'Incoming' }).populate('handledBy', 'name').populate('productId', 'name sku').sort({ createdAt: -1 });
        const outgoing = await Shipment.find({ type: 'Outgoing' }).populate('handledBy', 'name').populate('productId', 'name sku').sort({ createdAt: -1 });

        res.status(200).json({ incoming, outgoing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve Dispatch Requests
// @route   PUT /api/supervisor/approve-dispatch/:id
// @access  Private/Supervisor
const approveDispatch = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        if (shipment.type !== 'Outgoing') {
            return res.status(400).json({ message: 'Only outgoing shipments can be approved for dispatch' });
        }

        if (shipment.status !== 'Pending') {
            return res.status(400).json({ message: 'Shipment is already processed' });
        }

        shipment.status = 'Approved';
        shipment.approvedBy = req.user._id;

        // Decrease stock level since it's going out
        const product = await Product.findById(shipment.productId);
        if (product.quantity < shipment.quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }
        product.quantity -= shipment.quantity;
        await product.save();

        await shipment.save();
        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    View Inventory Reports
// @route   GET /api/supervisor/inventory-report
// @access  Private/Supervisor
const getInventoryReport = async (req, res) => {
    try {
        const products = await Product.find({});
        const locations = await StorageLocation.find().populate('productId', 'name sku');
        res.status(200).json({ products, locations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Manage Storage Allocation (Create/Update)
// @route   POST /api/supervisor/storage-location
// @access  Private/Supervisor
const manageStorageAllocation = async (req, res) => {
    try {
        const { zone, shelf, bin, capacity } = req.body;

        const locationExists = await StorageLocation.findOne({ zone, shelf, bin });
        if (locationExists) {
            return res.status(400).json({ message: 'Location already exists' });
        }

        const location = await StorageLocation.create({ zone, shelf, bin, capacity });
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get paginated storage locations
// @route   GET /api/supervisor/storage-location
// @access  Private/Supervisor
const getStorageLocations = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 5 } = req.query;
        const query = {
            $or: [
                { zone: { $regex: search, $options: 'i' } },
                { shelf: { $regex: search, $options: 'i' } },
                { bin: { $regex: search, $options: 'i' } }
            ]
        };

        const locations = await StorageLocation.find(query)
            .populate('productId', 'name sku')
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await StorageLocation.countDocuments(query);

        res.status(200).json({
            locations,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Storage Allocation
// @route   PUT /api/supervisor/storage-location/:id
// @access  Private/Supervisor
const updateStorageAllocation = async (req, res) => {
    try {
        const { zone, shelf, bin, capacity } = req.body;
        const location = await StorageLocation.findById(req.params.id);

        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        if (Number(capacity) < location.currentOccupancy) {
            return res.status(400).json({ message: 'Capacity cannot be less than current occupancy' });
        }

        location.zone = zone || location.zone;
        location.shelf = shelf || location.shelf;
        location.bin = bin || location.bin;
        location.capacity = capacity || location.capacity;

        await location.save();
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete Storage Allocation
// @route   DELETE /api/supervisor/storage-location/:id
// @access  Private/Supervisor
const deleteStorageAllocation = async (req, res) => {
    try {
        const location = await StorageLocation.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }

        if (location.currentOccupancy > 0) {
            return res.status(400).json({ message: 'Cannot delete a location that currently contains products' });
        }

        await StorageLocation.deleteOne({ _id: location._id });
        res.status(200).json({ message: 'Location deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOperations, approveDispatch, getInventoryReport, manageStorageAllocation, getStorageLocations, updateStorageAllocation, deleteStorageAllocation };
