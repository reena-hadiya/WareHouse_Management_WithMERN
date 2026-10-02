const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser, getWarehouseData, getReports, getRecords, deleteProduct } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

// Manage Staff and Supervisors
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Monitor Warehouse Data
router.get('/warehouse-data', getWarehouseData);

// Generate Operational Reports
router.get('/reports', getReports);

// Maintain Product and Shipment Records
router.get('/records', getRecords);
router.delete('/products/:id', deleteProduct);

module.exports = router;
