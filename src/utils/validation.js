// Simple, dependency-free validation helpers shared across every form
// in the app (Login, Signup, OTP, Delivery Address, etc).

export const rules = {
  required: (value, label = "This field") =>
    value === undefined || value === null || String(value).trim() === "" ? `${label} is required` : "",

  email: (value) => {
    if (!value) return "";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value) ? "" : "Enter a valid email address";
  },

  phone: (value) => {
    if (!value) return "";
    const re = /^[6-9]\d{9}$/; // 10-digit Indian mobile number
    return re.test(value) ? "" : "Enter a valid 10-digit phone number";
  },

  minLength: (value, len, label = "This field") => {
    if (!value) return "";
    return value.length < len ? `${label} must be at least ${len} characters` : "";
  },

  password: (value) => {
    if (!value) return "";
    // At least 8 chars, one letter, one number
    const re = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    return re.test(value) ? "" : "Password must be 8+ characters and include a letter and a number";
  },

  confirmPassword: (value, original) => {
    if (!value) return "";
    return value === original ? "" : "Passwords do not match";
  },

  pincode: (value) => {
    if (!value) return "";
    const re = /^\d{6}$/;
    return re.test(value) ? "" : "Enter a valid 6-digit postal pin";
  },

  otp: (value, length = 4) => {
    if (!value) return "";
    const re = new RegExp(`^\\d{${length}}$`);
    return re.test(value) ? "" : `Enter the ${length}-digit OTP`;
  },
};

/**
 * Validate a form object against a schema.
 * schema = { fieldName: [ (value, values) => errorString, ... ] }
 * Returns { isValid, errors }
 */
export function validateForm(values, schema) {
  const errors = {};
  Object.keys(schema).forEach((field) => {
    const validators = schema[field];
    for (const validator of validators) {
      const error = validator(values[field], values);
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  return { isValid: Object.keys(errors).length === 0, errors };
}
