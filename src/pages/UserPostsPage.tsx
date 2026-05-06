import { useParams } from "react-router-dom";
import Feed from "../features/feed/Feed";
import { Box, Typography } from "@mui/material";

const UserPostsPage = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <Box>
      <Box sx={{ mb: 4, textAlign: "center", pt: 4 }}>
        <Typography variant="h4" component="h1">
          Posts by @{userId}
        </Typography>
      </Box>
      <Feed userId={userId} />
    </Box>
  );
};

export default UserPostsPage;
