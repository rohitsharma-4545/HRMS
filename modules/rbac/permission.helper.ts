// modules/rbac/permission.helper.ts

import { AppUser } from "@/types/user";

export function hasPermission(user: AppUser, required: string | string[]) {
  if (!user?.permissions) return false;

  const requiredPermissions = Array.isArray(required) ? required : [required];

  return requiredPermissions.some((perm) => user.permissions.includes(perm));
}
