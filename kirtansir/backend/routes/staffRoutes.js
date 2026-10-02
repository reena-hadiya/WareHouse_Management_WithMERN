const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Route access: Staff or Admin
router.use(protect);
router.use(authorize('Staff', 'Admin'));

router.post('/stock', recordIncomingStock);
router.post('/storage/:productId', assignStorage);
router.post('/dispatch', prepareDispatch);
router.put('/shipments/:id', updateShipmentStatus);

router.get('/products', getProducts);
router.get('/locations', getLocations);
router.get('/incoming-stock', getIncomingStock);
router.put('/incoming-stock/:id', updateIncomingStock);
router.delete('/incoming-stock/:id', deleteIncomingStock);
router.get('/outgoing-stock', getOutgoingStock);

module.exports = router;
