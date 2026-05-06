import * as React from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

interface FormTextFieldProps {
  label: string;
  name: string;
  value: string;
  error?: string;
  helperText?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  required?: boolean;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  maxLength?: number;
}

/**
 * Reusable form text field component.
 * Wraps FormControl + FormLabel + TextField to reduce duplication.
 *
 * Now supports multiline + min/maxRows so it can be used for textareas (e.g. the
 * post body field) without re-implementing the FormLabel/TextField pairing.
 */
const FormTextField = React.forwardRef<HTMLDivElement, FormTextFieldProps>(
  (
    {
      label,
      name,
      value,
      error = "",
      helperText,
      onChange,
      disabled = false,
      type = "text",
      placeholder,
      autoComplete,
      autoFocus = false,
      required = true,
      multiline = false,
      minRows,
      maxRows,
      maxLength,
    },
    ref
  ) => {
    // When `error` is set it takes precedence over the neutral helperText.
    const displayHelperText = error || helperText;

    return (
      <FormControl ref={ref} fullWidth>
        <FormLabel htmlFor={name}>{label}</FormLabel>
        <TextField
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          fullWidth
          variant="outlined"
          value={value}
          onChange={onChange}
          error={Boolean(error)}
          helperText={displayHelperText}
          disabled={disabled}
          multiline={multiline}
          minRows={minRows}
          maxRows={maxRows}
          slotProps={maxLength ? { htmlInput: { maxLength } } : undefined}
          // The theme pins OutlinedInput height to 2.5rem; that clips multiline
          // textareas to a single line. Allow auto-grow when multiline.
          sx={
            multiline
              ? {
                  "& .MuiOutlinedInput-root": {
                    height: "auto",
                    alignItems: "flex-start",
                    paddingY: 1.25,
                  },
                }
              : undefined
          }
        />
      </FormControl>
    );
  }
);

FormTextField.displayName = "FormTextField";

export default FormTextField;
