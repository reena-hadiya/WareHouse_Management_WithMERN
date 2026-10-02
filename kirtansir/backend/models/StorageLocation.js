const mongoose = require('mongoose');

const storageLocationSchema = mongoose.Schema({
    zone: {
        type: String,
        required: true
    },
    shelf: {
        type: String,
        required: true
    },
    bin: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: null
    },
    capacity: {
        type: Number,
        required: true,
        default: 100
    },
    currentOccupancy: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const StorageLocation = mongoose.model('StorageLocation', storageLocationSchema);
module.exports = StorageLocation;
