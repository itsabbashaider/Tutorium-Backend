const express = require('express');

const authController = require('../controllers/auth.controller');

const validateRequest = require('../middlewares/validate.middleware');
const AsyncHandler = require('../middlewares/async-handler.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const {
        signupSchema,
        loginSchema
      } = require('../schemas/auth.schema');


const router = express.Router();

router.post(
  '/signup',
  validateRequest(signupSchema),
  AsyncHandler(authController.register)
);

router.post(
  '/login',
  validateRequest(loginSchema),
  AsyncHandler(authController.login)
);

router.post(
  '/logout',
  AsyncHandler(authController.logout)
);

router.get(
  "/me",
  authenticate,
  AsyncHandler(authController.getMe)
);

module.exports = router;