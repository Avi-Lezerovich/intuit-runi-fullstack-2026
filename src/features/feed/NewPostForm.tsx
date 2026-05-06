import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { createPost } from "../../api/posts";
import FormTextField from "../../components/ui/FormTextField";

const initialValues = { title: "", body: "" };

// Validation limits for the post fields. Centralised so the helper text and
// the maxLength on the input stay in sync.
const TITLE_MAX = 80;
const BODY_MAX = 2000;
const TITLE_MIN = 3;
const BODY_MIN = 10;

const NewPostForm = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as soon as the user starts editing.
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const result: Record<string, string> = {};
    const title = values.title.trim();
    const body = values.body.trim();

    if (!title) {
      result.title = "Title cannot be empty";
    } else if (title.length < TITLE_MIN) {
      result.title = `Title must be at least ${TITLE_MIN} characters`;
    }

    if (!body) {
      result.body = "Body cannot be empty";
    } else if (body.length < BODY_MIN) {
      result.body = `Body must be at least ${BODY_MIN} characters`;
    }

    setErrors(result);
    return Object.keys(result).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSubmitError("");

    try {
      await createPost({
        title: values.title.trim(),
        body: values.body.trim(),
      });

      // Show a brief success snackbar, then redirect home.
      setSuccess(true);
      timeoutRef.current = setTimeout(() => navigate("/", { replace: true }), 900);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to publish post"
      );
      setLoading(false);
    }
  };

  // Live counters shown in the helperText slot — gives the user a sense of room.
  const titleCounter = `${values.title.length} / ${TITLE_MAX}`;
  const bodyCounter = `${values.body.length} / ${BODY_MAX}`;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 760, mx: "auto" }}>
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 3,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            Create New Post
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Share an article with the community. Markdown is supported in the body.
          </Typography>
        </Stack>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError("")}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            <FormTextField
              label="Title"
              name="title"
              placeholder="Give your post a clear, specific title"
              value={values.title}
              onChange={handleChange}
              error={errors.title}
              helperText={titleCounter}
              disabled={loading}
              autoFocus
              maxLength={TITLE_MAX}
            />

            <FormTextField
              label="Body"
              name="body"
              placeholder="Write your post content here…"
              value={values.body}
              onChange={handleChange}
              error={errors.body}
              helperText={bodyCounter}
              disabled={loading}
              multiline
              minRows={8}
              maxRows={20}
              maxLength={BODY_MAX}
            />

            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : null
                }
                sx={{ minWidth: 140 }}
              >
                {loading ? "Publishing…" : "Publish"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={1200}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Post published successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NewPostForm;
