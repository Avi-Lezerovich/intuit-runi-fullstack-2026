import { useState } from "react";

interface UseExpandableTextArgs {
  text: string;
  /** ברירת מחדל: 180 תווים. */
  threshold?: number;
  /** ל-preview mode — מתעלם מ-state הפנימי ומחזיר expanded=true. */
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
