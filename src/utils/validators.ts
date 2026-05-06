/**
 * Provides reusable, composable field validators.
 * Each validator has a validation function and error message.
 */

export interface Validator {
  validate: (value: string) => boolean;
  message: string;
}

export const emailValidators: Validator[] = [
  {
    validate: (value: string) => !value.trim(),
    message: "Email is required",
  },
  {
    validate: (value: string) =>
      !/\S+@\S+\.\S+/.test(value.trim()),
    message: "Please enter a valid email address",
  },
];

export const passwordValidators: Validator[] = [
  {
    validate: (value: string) => !value,
    message: "Password is required",
  },
  {
    validate: (value: string) => value.length < 6,
    message: "Password must be at least 6 characters",
  },
];

export const nameValidators: Validator[] = [
  {
    validate: (value: string) => !value.trim(),
    message: "Full name is required",
  },
];

export const getPasswordMatchValidators = (
  passwordToMatch: string
): Validator[] => [
  {
    validate: (value: string) => !value,
    message: "Please confirm your password",
  },
  {
    validate: (value: string) => value !== passwordToMatch,
    message: "Passwords do not match",
  },
];
