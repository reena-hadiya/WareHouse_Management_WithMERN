const Product = require('../models/Product');
const StorageLocation = require('../models/StorageLocation');
const Shipment = require('../models/Shipment');

// @desc    Record Incoming Stock
// @route   POST /api/staff/stock
// @access  Private/Staff
const recordIncomingStock = async (req, res) => {
    try {
        const { name, sku, category, quantity, price, description } = req.body;

        let product = await Product.findOne({ sku });
        if (product) {
            product.quantity += Number(quantity);
            await product.save();
        } else {
            product = await Product.create({ name, sku, category, quantity, price, description });
        }

        // Also record as a shipment
        await Shipment.create({
            type: 'Incoming',
            productId: product._id,
            quantity: Number(quantity),
            status: 'Delivered',
            handledBy: req.user._id
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Assign Storage Location
// @route   POST /api/staff/storage/:productId
// @access  Private/Staff
const assignStorage = async (req, res) => {
    try {
        const { locationId, quantity } = req.body;
        const product = await Product.findById(req.params.productId);
        const location = await StorageLocation.findById(locationId);

        if (!product || !location) {
            return res.status(404).json({ message: 'Product or Location not found' });
        }

        if (location.productId && location.productId.toString() !== product._id.toString() && location.currentOccupancy > 0) {
            return res.status(400).json({ message: 'Error: This bin already contains a completely different product. Please choose an empty location.' });
        }

        // Calculate how many units are already sitting on shelves everywhere
        const existingAssignments = await StorageLocation.find({ productId: product._id });
        const assignedQuantity = existingAssignments.reduce((acc, loc) => acc + loc.currentOccupancy, 0);

        // Math check to ensure staff isn't pulling products out of nowhere
        const unassignedInReceiving = product.quantity - assignedQuantity;
        if (Number(quantity) > unassignedInReceiving) {
            return res.status(400).json({ message: `Cannot print inventory! Only ${unassignedInReceiving} units are unassigned in receiving.` });
        }

        if (location.currentOccupancy + Number(quantity) > location.capacity) {
            return res.status(400).json({ message: 'Exceeds storage capacity' });
        }

        location.productId = product._id;
        location.currentOccupancy += Number(quantity);
        await location.save();

        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Prepare order for dispatch
// @route   POST /api/staff/dispatch
// @access  Private/Staff
const prepareDispatch = async (req, res) => {
    try {
        const { productId, quantity, locationId } = req.body;

        // This just requests dispatch. Supervisor approves it.
        const shipment = await Shipment.create({
            type: 'Outgoing',
            productId,
            quantity,
            status: 'Pending',
            handledBy: req.user._id,
            locationId
        });

        res.status(201).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update shipment status
// @route   PUT /api/staff/shipments/:id
// @access  Private/Staff
const updateShipmentStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'Dispatched', 'Delivered'
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Only allow if approved
        if (status === 'Dispatched' && shipment.status !== 'Approved') {
            return res.status(400).json({ message: 'Shipment must be approved by supervisor first' });
        }

        shipment.status = status;
        await shipment.save();

        res.status(200).json(shipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products for inventory check
// @route   GET /api/staff/products
// @access  Private/Staff
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all storage locations
// @route   GET /api/staff/locations
// @access  Private/Staff
const getLocations = async (req, res) => {
    try {
        const locations = await StorageLocation.find({}).populate('productId', 'name sku');
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get incoming stock records
// @route   GET /api/staff/incoming-stock
// @access  Private/Staff
const getIncomingStock = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 5 } = req.query;
        
        // Find matching product IDs based on search
        let productFilter = {};
        if (search) {
            const products = await Product.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { sku: { $regex: search, $options: 'i' } }
                ]
            }).select('_id');
            const productIds = products.map(p => p._id);
            productFilter = { productId: { $in: productIds } };
        }

        const query = { type: 'Incoming', ...productFilter };

        const shipments = await Shipment.find(query)
            .populate('productId', 'name sku category price')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Shipment.countDocuments(query);

        res.status(200).json({
            shipments,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update an incoming stock record
// @route   PUT /api/staff/incoming-stock/:id
// @access  Private/Staff
const updateIncomingStock = async (req, res) => {
    try {
        const { quantity, name, sku, category, price } = req.body;
        const shipment = await Shipment.findById(req.params.id);
        
        if (!shipment) return res.status(404).json({ message: 'Record not found' });
        if (shipment.type !== 'Incoming') return res.status(400).json({ message: 'Not an incoming record' });

        const difference = Number(quantity) - shipment.quantity;
        
        // Update Product quantity and details
        const product = await Product.findById(shipment.productId);
        if (product) {
            product.quantity += difference;
            if (product.quantity < 0) return res.status(400).json({ message: 'Cannot reduce product quantity below 0' });
            
            if (name) product.name = name;
            if (sku && sku !== product.sku) {
                const existingProduct = await Product.findOne({ sku });
                if (existingProduct) {
                    return res.status(400).json({ message: 'SKU already exists for another product' });
                }
                product.sku = sku;
            }
            if (category) product.category = category;
            if (price !== undefined) product.price = Number(price);

            await product.save();
        }

        shipment.quantity = Number(quantity);
        await shipment.save();

        res.status(200).json({ message: 'Stock record updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an incoming stock record
// @route   DELETE /api/staff/incoming-stock/:id
// @access  Private/Staff
const deleteIncomingStock = async (req, res) => {
    try {
        const shipment = await Shipment.findById(req.params.id);
        if (!shipment) return res.status(404).json({ message: 'Record not found' });

        // Update Product quantity
        const product = await Product.findById(shipment.productId);
        if (product) {
            product.quantity -= shipment.quantity;
            if (product.quantity < 0) product.quantity = 0; // Prevent negative stock safely
            await product.save();
        }

        await Shipment.deleteOne({ _id: shipment._id });
        res.status(200).json({ message: 'Stock record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get outgoing stock records
// @route   GET /api/staff/outgoing-stock
// @access  Private/Staff
const getOutgoingStock = async (req, res) => {
    try {
        const shipments = await Shipment.find({ type: 'Outgoing' }).populate('productId', 'name sku').sort({ createdAt: -1 });
        res.status(200).json(shipments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    recordIncomingStock,
    assignStorage,
    prepareDispatch,
    updateShipmentStatus,
    getProducts,
    getLocations,
    getIncomingStock,
    updateIncomingStock,
    deleteIncomingStock,
    getOutgoingStock
};
