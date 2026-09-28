const express = require('express');
const onboardingController = require('../controllers/role-selection.controller');
const asyncHandler = require('../middlewares/async-handler.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post(
  '/role',
  authenticate,
  asyncHandler(onboardingController.selectRole)
);

module.exports = router;