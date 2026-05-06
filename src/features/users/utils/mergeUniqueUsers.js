// Merge new users into the current list while skipping duplicate ids.

import { mergeUniqueItems } from "../../../utils/mergeUtils";

export const mergeUniqueUsers = (previousUsers, incomingUsers) => {
  return mergeUniqueItems(previousUsers, incomingUsers, "id");
};
