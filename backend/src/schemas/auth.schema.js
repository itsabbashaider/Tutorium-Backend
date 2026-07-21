const Joi = require('joi');

// ─── SIGNUP/REGISTRATION SCHEMA ──────────────────────────────────────────────
exports.signupSchema = Joi.object({
  full_name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 3 characters',
      'string.max': 'Full name must not exceed 50 characters',
      'any.required': 'Full name is required',
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) // Strict regex layout
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.pattern.base': 'Please enter a valid email address structure (e.g., name@domain.com)',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .min(6)
    .max(50)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.max': 'Password must not exceed 50 characters',
      'any.required': 'Password is required',
    }),

  city: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'City directory location is required',
      'any.required': 'City is required',
    }),

  phone_number: Joi.string()
    .trim()
    .required()
    .messages({
      'string.empty': 'Contact phone number is required',
      'any.required': 'Phone number is required',
    }),

  role: Joi.string()
    .valid('STUDENT', 'TUTOR')
    .required()
    .messages({
      'any.only': 'Role choice must be either STUDENT or TUTOR',
      'any.required': 'User role is required',
    }),

  timezone: Joi.string()
    .optional()
});

// ─── LOGIN SCHEMA ────────────────────────────────────────────────────────────
exports.loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),

  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required',
    }),
});

// ─── CHANGE PASSWORD SCHEMA ──────────────────────────────────────────────────
exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required',
    }),

  newPassword: Joi.string()
    .min(6)
    .max(50)
    .required()
    .messages({
      'string.min': 'New password must be at least 6 characters',
      'string.max': 'New password must not exceed 50 characters',
      'any.required': 'New password is required',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required',
    }),
}).custom((value, helpers) => {
  if (value.currentPassword === value.newPassword) {
    return helpers.message('New password must be different from current password');
  }
  return value;
});

// ─── UPDATE PROFILE SCHEMA ───────────────────────────────────────────────────
exports.updateProfileSchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Full name must be at least 3 characters',
      'string.max': 'Full name must not exceed 50 characters',
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Please enter a valid email address',
    }),

  city: Joi.string()
    .trim()
    .optional(),

  phoneNumber: Joi.string()
    .trim()
    .optional(),

  timezone: Joi.string()
    .optional()
});