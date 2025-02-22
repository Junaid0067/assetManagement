import { useAuth } from "./use-auth";
import { Permissions, type Role } from "@shared/schema";

export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role as Role;

  return {
    canManageUsers: role ? Permissions.canManageUsers(role) : false,
    canManageItems: role ? Permissions.canManageItems(role) : false,
    canManageEmployees: role ? Permissions.canManageEmployees(role) : false,
    canViewReports: role ? Permissions.canViewReports(role) : false,
    canCreateReports: role ? Permissions.canCreateReports(role) : false,
  };
}
