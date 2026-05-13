import { Box, Card, CardActions, CardContent, Divider, Typography } from "@mui/material";

import type { Post, VoteSide } from "../../types";
import { usePostVote } from "../../hooks/usePostVote";
import { PostHotBadge } from "./PostHotBadge";
import { PostCaseHeader } from "./PostCaseHeader";
import { PostAuthorHeader } from "./PostAuthorHeader";
import { PostTitle } from "./PostTitle";
import { PostPartiesBanner } from "./PostPartiesBanner";
import { PostChargesList } from "./PostChargesList";
import { PostBody } from "./PostBody";
import { PostMetaSection } from "./PostMetaSection";
import { PostVoteBar } from "./PostVoteBar";
import { PostActions } from "./PostActions";

interface Props {
  post: Post;
  currentUserId?: number;
  onDelete?: (id: number) => void;
  /** Render as a static preview (no actions, no truncation) — used in NewPost. */
  preview?: boolean;
  /** Notify parent when vote tallies change (so the parent can update its list). */
  onVoteChange?: (postId: number, guilty: number, innocent: number) => void;
}

const HOT_THRESHOLD = 200;

/**
 * The lawsuit card component — the main Post display used in Home feed, ProfilePage, and NewPost preview.
 * Orchestrator: derives flags (isOwner / canVote / isHot), runs usePostVote hook, composes sub-components.
 * Every visual section (author header, title, banner, etc.) lives in its own file.
 * The `preview` prop renders a static, action-free card for the NewPost preview panel.
 * @param post - The Post object to render.
 * @param currentUserId - Current logged-in user's ID (if any) for ownership and vote checks.
 * @param onDelete - Callback when the post owner clicks delete. Only shown if isOwner is true.
 * @param preview - If true, renders a static read-only card (used by NewPost preview).
 * @param onVoteChange - Callback when vote tallies change (so parent can update its list).
 */
const SinglePost = ({ post, currentUserId, onDelete, preview = false, onVoteChange }: Props) => {
  const isAuthenticated = !!currentUserId;
  const isOwner = isAuthenticated && currentUserId === post.author_id;
  const canVote = isAuthenticated && !isOwner && !preview;
  const isHot = post.guilty_votes + post.innocent_votes >= HOT_THRESHOLD;
  const hasCharges = !!post.charges && post.charges.length > 0;
  const hasMeta = !!(post.location || post.damages);
  const showMetaSection = hasMeta || !preview; // signature line renders even without location/damages

  const { myVote, voting, voteError, vote } = usePostVote({
    postId: post.id,
    enabled: canVote,
  });

  const handleVote = async (side: VoteSide) => {
    const result = await vote(side);
    if (result) onVoteChange?.(post.id, result.guilty_votes, result.innocent_votes);
  };

  return (
    <Card sx={{ overflow: "visible", position: "relative" }}>
      {isHot && !preview && <PostHotBadge />}

      {!preview && (
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}lolsuit-seal.svg`}
          alt=""
          aria-hidden
          sx={{
            position: "absolute",
            top: "50%",
            insetInlineEnd: 16,
            transform: "translateY(-50%) rotate(-6deg)",
            width: 200,
            height: 200,
            opacity: 0.04,
            pointerEvents: "none",
            zIndex: 0,
            display: { xs: "none", sm: "block" },
          }}
        />
      )}

      <CardContent sx={{ pb: 1, position: "relative", zIndex: 1 }}>
        {!preview && <PostCaseHeader postId={post.id} createdAt={post.created_at} />}

        <PostAuthorHeader
          authorId={post.author_id}
          authorName={post.author_name}
          createdAt={post.created_at}
          preview={preview}
        />

        <PostTitle title={post.title} preview={preview} />

        <PostPartiesBanner
          plaintiffName={post.author_name}
          defendantName={post.defendant}
          preview={preview}
        />

        {hasCharges && <PostChargesList charges={post.charges!} />}

        <PostBody text={post.body} preview={preview} />

        {showMetaSection && (
          <PostMetaSection
            location={post.location}
            damages={post.damages}
            signedBy={post.author_name}
            createdAt={post.created_at}
            preview={preview}
          />
        )}

        <PostVoteBar
          guiltyVotes={post.guilty_votes}
          innocentVotes={post.innocent_votes}
          myVote={myVote}
        />

        {voteError && (
          <Typography variant="caption" sx={{ color: "error.main", display: "block", mt: 1 }}>
            {voteError}
          </Typography>
        )}
      </CardContent>

      {!preview && (
        <>
          <Divider />
          <CardActions sx={{ px: 2, py: 1.25, justifyContent: "space-between", flexWrap: "wrap", gap: 1, position: "relative", zIndex: 1 }}>
            <PostActions
              myVote={myVote}
              voting={voting}
              canVote={canVote}
              isOwner={isOwner}
              isAuthenticated={isAuthenticated}
              onVote={handleVote}
              onDelete={onDelete ? () => onDelete(post.id) : undefined}
            />
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default SinglePost;
