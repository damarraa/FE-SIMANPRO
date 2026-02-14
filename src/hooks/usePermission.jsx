import { useAuthStore } from "../store/authStore";

export const usePermission = () => {
  const user = useAuthStore((state) => state.user);
  const can = (permissionName) => {
    if (!user) return false;

    if (user.roles && user.roles.includes("Super Admin")) {
      return true;
    }

    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(permissionName);
    }

    return false;
  };

  const canAny = (permissionsArray) => {
    return permissionsArray.some((perm) => can(perm));
  };

  return { can, canAny, user };
};
