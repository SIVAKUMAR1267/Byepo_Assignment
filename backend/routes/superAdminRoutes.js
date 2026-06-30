const express = require('express');
const { loginSuperAdmin, createOrganization, getOrganizations } = require('../controllers/superAdminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginSuperAdmin);

router.route('/organizations')
  .post(protect, authorize('SUPER_ADMIN'), createOrganization)
  .get(protect, authorize('SUPER_ADMIN'), getOrganizations);

module.exports = router;