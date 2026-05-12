import { useState } from "react";
import { votePost, getMyVote, setMyVote } from "../api";
import type { VoteSide, VoteResponse } from "../types";

interface UsePostVoteArgs {
  postId: number;
  /** false ב-preview / אם אין currentUser / אם המשתמש הוא הבעלים — מבטל את ה-hydration וה-vote. */
  enabled: boolean;
}

interface UsePostVoteResult {
  myVote: VoteSide | null;
  voting: boolean;
  voteError: string | null;
  /** מחזיר את ה-VoteResponse להעברה ל-onVoteChange של ה-parent, או null אם נכשל/מבוטל. */
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
