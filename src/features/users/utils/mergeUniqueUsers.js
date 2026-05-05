// Merge new users into the current list while skipping duplicate ids.

export const mergeUniqueUsers = (previousUsers, incomingUsers) => {
  const seenIds = new Set(previousUsers.map((user) => user.id));
  const uniqueIncomingUsers = incomingUsers.filter((user) => !seenIds.has(user.id));
  return [...previousUsers, ...uniqueIncomingUsers];
};
