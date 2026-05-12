/** Hook managing read-more / read-less toggle state for long text blocks. */
import { useState } from "react";

/**
 * Manages the "read more / read less" state for a possibly-long text block.
 * Generic enough to reuse for any expandable text section (post bodies today,
 * comments/reviews in the future).
 */

interface UseExpandableTextArgs {
  text: string;
  /** Character length above which the text is considered "long". Defaults to 180. */
  threshold?: number;
  /** When true, the hook always reports expanded=true regardless of internal state.
   *  Used by the NewPost preview to show the full body without a "read more" button. */
  forceExpanded?: boolean;
}

interface UseExpandableTextResult {
  expanded: boolean;
  isLong: boolean;
  toggle: () => void;
}

export const useExpandableText = ({
  text,
  threshold = 180,
  forceExpanded = false,
}: UseExpandableTextArgs): UseExpandableTextResult => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > threshold;
  return {
    expanded: forceExpanded || expanded,
    isLong,
    toggle: () => setExpanded((v) => !v),
  };
};
