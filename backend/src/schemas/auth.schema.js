const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| Shared password rule
|--------------------------------------------------------------------------
*/
const passwordSchema = Joi.string()
  .min(8)
  .max(50)
  .pattern(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/
  )
  .messages({
    "string.empty":
      "Password is required.",

    "string.min":
      "Password must be at least 8 characters.",

    "string.max":
      "Password must not exceed 50 characters.",

    "string.pattern.base":
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.",

    "any.required":
      "Password is required.",
  });

/*
|--------------------------------------------------------------------------
| Signup / Registration
|--------------------------------------------------------------------------
*/
const signupSchema = Joi.object({
  full_name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty":
        "Full name is required.",

      "string.min":
        "Full name must be at least 3 characters.",

      "string.max":
        "Full name must not exceed 50 characters.",

      "any.required":
        "Full name is required.",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )
    .required()
    .messages({
      "string.empty":
        "Email is required.",

      "string.pattern.base":
        "Please enter a valid email address structure (e.g., name@domain.com).",

      "any.required":
        "Email is required.",
    }),

  password: passwordSchema
    .required()
    .messages({
      "any.required":
        "Password is required.",
    }),

  city: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty":
        "City is required.",

      "any.required":
        "City is required.",
    }),

  phone_number: Joi.string()
    .trim()
    .required()
    .messages({
      "string.empty":
        "Phone number is required.",

      "any.required":
        "Phone number is required.",
    }),

  role: Joi.string()
    .valid("STUDENT", "TUTOR")
    .required()
    .messages({
      "any.only":
        "Role must be either STUDENT or TUTOR.",

      "any.required":
        "User role is required.",
    }),

  timezone: Joi.string()
    .trim()
    .allow("")
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/
const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )
    .required()
    .messages({
      "string.empty":
        "Email is required.",

      "string.pattern.base":
        "Please enter a valid email address structure (e.g., name@domain.com).",

      "any.required":
        "Email is required.",
    }),

  password: passwordSchema.required(),
});

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/
const changePasswordSchema = Joi.object({
  current_password: Joi.string()
    .required()
    .messages({
      "string.empty":
        "Current password is required.",

      "any.required":
        "Current password is required.",
    }),

  new_password: passwordSchema
    .required()
    .messages({
      "any.required":
        "New password is required.",
    }),

  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("new_password"))
    .messages({
      "string.empty":
        "Password confirmation is required.",

      "any.only":
        "Passwords do not match.",

      "any.required":
        "Password confirmation is required.",
    }),
}).custom((value, helpers) => {
  if (
    value.current_password ===
    value.new_password
  ) {
    return helpers.message(
      "New password must be different from current password."
    );
  }

  return value;
});

/*
|--------------------------------------------------------------------------
| Update User Profile
|--------------------------------------------------------------------------
*/
const updateProfileSchema = Joi.object({
  full_name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .optional()
    .messages({
      "string.min":
        "Full name must be at least 3 characters.",

      "string.max":
        "Full name must not exceed 50 characters.",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    )
    .optional()
    .messages({
      "string.pattern.base":
        "Please enter a valid email address structure (e.g., name@domain.com).",
    }),

  city: Joi.string()
    .trim()
    .optional(),

  phone_number: Joi.string()
    .trim()
    .optional(),

  timezone: Joi.string()
    .trim()
    .allow("")
    .optional(),
}).min(1);

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/
module.exports = {
  passwordSchema,
  signupSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
};