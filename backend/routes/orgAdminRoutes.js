const express = require('express');
const { signup, login, getFlags, createFlag, updateFlag, deleteFlag } = require('../controllers/orgAdminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.use(protect);
router.use(authorize('ORG_ADMIN'));

router.route('/flags')
  .get(getFlags)
  .post(createFlag);

router.route('/flags/:id')
  .put(updateFlag)
  .delete(deleteFlag);

module.exports = router;