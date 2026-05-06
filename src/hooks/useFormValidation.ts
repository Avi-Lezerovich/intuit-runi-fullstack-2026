import * as React from "react";
import { Validator } from "./useFieldValidators";

interface UseFormValidationOptions {
  initialValues: Record<string, string>;
  validationRules: Record<string, Validator[]>;
}

interface UseFormValidationReturn {
  values: Record<string, string>;
  errors: Record<string, string>;
  loading: boolean;
  submitError: string | null;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validate: () => boolean;
  resetForm: () => void;
  setLoading: (loading: boolean) => void;
  setSubmitError: (error: string | null) => void;
  clearError: (fieldName: string) => void;
}

/**
 * Custom hook for managing form state, validation, and error handling.
 * Eliminates duplicated form logic across components.
 */
export const useFormValidation = ({
  initialValues,
  validationRules,
}: UseFormValidationOptions): UseFormValidationReturn => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      clearError(name);
    }
  };

  const validate = (): boolean => {
    const result: Record<string, string> = {};

    Object.keys(validationRules).forEach((fieldName) => {
      const fieldValidators = validationRules[fieldName];
      for (const rule of fieldValidators) {
        if (rule.validate(values[fieldName])) {
          result[fieldName] = rule.message;
          break;
        }
      }
    });

    setErrors(result);
    return Object.keys(result).length === 0;
  };

  const clearError = (fieldName: string) => {
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitError(null);
    setLoading(false);
  };

  return {
    values,
    errors,
    loading,
    submitError,
    handleChange,
    validate,
    resetForm,
    setLoading,
    setSubmitError,
    clearError,
  };
};
