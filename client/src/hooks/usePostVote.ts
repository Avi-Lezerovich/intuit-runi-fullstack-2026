/** Vote-on-a-post flow: hydration from localStorage + API submit + loading/error state. */
import { useState } from "react";
import { votePost, getMyVote, setMyVote } from "../api";
import type { VoteSide, VoteResponse } from "../types";

/**
 * Encapsulates the "vote on a post" flow for one specific post:
 *   - hydrates the user's previous vote (if any) from localStorage on mount
 *   - submits a vote to the API, updates localStorage, and exposes loading/error state
 *
 * The `enabled` flag short-circuits the hook in three cases where voting makes no sense:
 * preview mode, anonymous user, or the user is the post's author. When disabled,
 * `vote()` is a no-op and no localStorage read happens on mount.
 */

interface UsePostVoteArgs {
  postId: number;
  enabled: boolean;
}

interface UsePostVoteResult {
  myVote: VoteSide | null;
  voting: boolean;
  voteError: string | null;
  /** Returns the server response so the orchestrator can call onVoteChange on the parent,
   *  or null when the call was skipped (disabled / in-flight) or failed. */
  vote: (side: VoteSide) => Promise<VoteResponse | null>;
}

export const usePostVote = ({ postId, enabled }: UsePostVoteArgs): UsePostVoteResult => {
  const [myVote, setMyVoteState] = useState<VoteSide | null>(() =>
    enabled ? getMyVote(postId) : null,
  );
  const [voting, setVoting] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const vote = async (side: VoteSide): Promise<VoteResponse | null> => {
    if (!enabled || voting) return null;
    setVoting(true);
    setVoteError(null);
    try {
      const result = await votePost(postId, side);
      setMyVote(postId, side);
      setMyVoteState(side);
      return result;
    } catch (err) {
      setVoteError(err instanceof Error ? err.message : "שגיאת הצבעה");
      return null;
    } finally {
      setVoting(false);
    }
  };

  return { myVote, voting, voteError, vote };
};
