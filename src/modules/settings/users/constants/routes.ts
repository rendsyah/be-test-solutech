export const USERS_ROUTES = {
  root: '/settings/setup-users',
  create: '/settings/setup-users/new',
  detail: (id: string) => `/settings/setup-users/${id}`,
  edit: (id: string) => `/settings/setup-users/${id}/edit`,
};
