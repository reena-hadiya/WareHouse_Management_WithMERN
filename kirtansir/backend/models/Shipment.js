const mongoose = require('mongoose');

const shipmentSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['Incoming', 'Outgoing'],
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Dispatched', 'Delivered'],
        default: 'Pending'
    },
    handledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    locationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StorageLocation'
    }
}, {
    timestamps: true
});

const Shipment = mongoose.model('Shipment', shipmentSchema);
module.exports = Shipment;
