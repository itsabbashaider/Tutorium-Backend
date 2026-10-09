const express = require('express');

const authController = require('../controllers/auth.controller');

const validateRequest = require('../middlewares/validate.middleware');
const AsyncHandler = require('../middlewares/async-handler.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const {
        signupSchema,
        loginSchema,
        resetPasswordSchema,
        changePasswordSchema,
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

router.get(
  '/google',
  AsyncHandler(authController.googleRedirect)
);

router.get(
  '/google/callback',
  AsyncHandler(authController.googleCallback)
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

// Protected route for users to set/update their Q&A in settings
router.put(
  '/security-qa',
  authenticate,
  AsyncHandler(authController.setupSecurityQA)
);

// Public routes for recovery flow
router.post(
  '/security-question',
  AsyncHandler(authController.getSecurityQuestion)
);

router.post(
  '/verify-security-answer',
  AsyncHandler(authController.verifySecurityAnswer)
);

router.post(
  '/reset-password-qa',
  validateRequest(resetPasswordSchema), 
  AsyncHandler(authController.resetPasswordWithQA)
);

router.post(
  "/change-password",
  authenticate, // Protects route so req.user is available
  validateRequest(changePasswordSchema),
  AsyncHandler(authController.changePassword)
);

module.exports = router;