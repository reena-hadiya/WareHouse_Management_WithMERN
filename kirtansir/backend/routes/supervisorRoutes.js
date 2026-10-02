const express = require('express');
const router = express.Router();
const { getOperations, approveDispatch, getInventoryReport, manageStorageAllocation, getStorageLocations, updateStorageAllocation, deleteStorageAllocation } = require('../controllers/supervisorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Supervisor', 'Admin'));

router.get('/operations', getOperations);
router.put('/approve-dispatch/:id', approveDispatch);
router.get('/inventory-report', getInventoryReport);

router.post('/storage-location', manageStorageAllocation);
router.get('/storage-location', getStorageLocations);
router.put('/storage-location/:id', updateStorageAllocation);
router.delete('/storage-location/:id', deleteStorageAllocation);

module.exports = router;
