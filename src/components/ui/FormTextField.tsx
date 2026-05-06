import * as React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

interface FormTextFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

/**
 * Reusable form text field component.
 * Wraps FormControl + FormLabel + TextField to reduce duplication.
 */
const FormTextField = React.forwardRef<HTMLDivElement, FormTextFieldProps>(
  (
    {
      label,
      name,
      value,
      error = "",
      onChange,
      disabled = false,
      type = "text",
      placeholder,
      autoComplete,
      autoFocus = false,
    },
    ref
  ) => {
    return (
      <FormControl ref={ref}>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <TextField
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required
          fullWidth
          variant="outlined"
          value={value}
          onChange={onChange}
          error={Boolean(error)}
          helperText={error}
          disabled={disabled}
        />
      </FormControl>
    );
  }
);

FormTextField.displayName = "FormTextField";

export default FormTextField;
