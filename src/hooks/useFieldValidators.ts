/**
 * Provides reusable, composable field validators.
 * Each validator has a validation function and error message.
 */

export interface Validator {
  validate: (value: string) => boolean;
  message: string;
}

export const useFieldValidators = () => {
  const emailValidators: Validator[] = [
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

  const passwordValidators: Validator[] = [
    {
      validate: (value: string) => !value,
      message: "Password is required",
    },
    {
      validate: (value: string) => value.length < 6,
      message: "Password must be at least 6 characters",
    },
  ];

  const nameValidators: Validator[] = [
    {
      validate: (value: string) => !value.trim(),
      message: "Full name is required",
    },
  ];

  const passwordMatchValidators = (
    confirmPassword: string,
    password: string
  ): Validator[] => [
    {
      validate: () => !confirmPassword,
      message: "Please confirm your password",
    },
    {
      validate: () => confirmPassword !== password,
      message: "Passwords do not match",
    },
  ];

  return {
    emailValidators,
    passwordValidators,
    nameValidators,
    passwordMatchValidators,
  };
};
