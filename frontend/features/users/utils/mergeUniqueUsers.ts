// Merge new users into the current list while skipping duplicate ids.

import { mergeUniqueItems } from "../../../utils/mergeUtils";
import type { User } from "../../../types";

export const mergeUniqueUsers = (
  previousUsers: User[],
  incomingUsers: User[]
): User[] => {
  return mergeUniqueItems(previousUsers, incomingUsers, "id");
};
