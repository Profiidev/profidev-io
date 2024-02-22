export enum Permissions {
  Admin = 0,
  Users = 1,
  Metrics = 2,
  Cloud = 4,
  Portainer = 8,
  Database = 16,
}

export const checkPermission = (permission: Permissions, permissions: number) => {
  return (permissions & permission) === permission || permissions === Permissions.Admin;
}