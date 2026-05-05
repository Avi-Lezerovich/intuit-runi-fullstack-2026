import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { createPost } from "../../api/posts";

const initialValues = { title: "", body: "" };

export default function NewPostForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const result = {};
    if (!values.title.trim()) {
      result.title = "Title cannot be empty";
    }
    if (!values.body.trim()) {
      result.body = "Body cannot be empty";
    }

    setErrors(result);
    return Object.keys(result).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    try {
      await createPost({
        title: values.title.trim(),
        body: values.body.trim(),
      });

      navigate("/", { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to publish post");
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 760, mx: "auto" }}>
      <Paper elevation={1} sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: "bold" }}>
          Create New Post
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            name="title"
            label="Title"
            placeholder="Enter your post title..."
            value={values.title}
            onChange={handleChange}
            error={Boolean(errors.title)}
            helperText={errors.title}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            name="body"
            label="Body"
            placeholder="Write your post content here..."
            value={values.body}
            onChange={handleChange}
            multiline
            minRows={4}
            error={Boolean(errors.body)}
            helperText={errors.body}
            disabled={loading}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: 120 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Publish"}
            </Button>

            <Button variant="outlined" onClick={() => navigate("/")} disabled={loading}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}