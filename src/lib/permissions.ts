export enum Permissions {
  Admin = 1,
  Users = 2,
  Metrics = 4,
  Cloud = 8,
  Portainer = 16,
  Database = 32,
}

export const checkPermission = (
  permissions: number,
  permission: Permissions,
) => {
  return (
    (permissions & permission) === permission ||
    (permissions & Permissions.Admin) === Permissions.Admin
  );
};
