export const ROLES_ROUTES = {
  root: '/settings/setup-roles',
  create: '/settings/setup-roles/new',
  detail: (id: string) => `/settings/setup-roles/${id}`,
  edit: (id: string) => `/settings/setup-roles/${id}/edit`,
};
