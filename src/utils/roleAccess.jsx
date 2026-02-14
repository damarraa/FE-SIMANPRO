export const hasPermission = (userRoles, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  return userRoles.some((role) => allowedRoles.includes(role));
};

export const getAccessibleModules = (userRoles, menuStructure) => {
  return menuStructure
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        hasPermission(userRoles, item.allowedRoles)
      ),
    }))
    .filter((group) => group.items.length > 0);
};
