export const PRODUCT_ROUTES = {
  root: '/products',
  create: '/products/new',
  edit: (id: string) => `/products/${id}/edit`,
};
