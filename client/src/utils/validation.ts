/**
 * Validate email format using regex
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate User Registration input
 */
export const validateRegisterInput = ({ name, email, password }: Record<string, any>) => {
  const errors: string[] = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
    errors.push("Valid email address is required");
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate User Login input
 */
export const validateLoginInput = ({ email, password }: Record<string, any>) => {
  const errors: string[] = [];

  if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
    errors.push("Valid email address is required");
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
