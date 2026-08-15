type HeaderMode = 'list' | 'create' | 'edit';

type HeaderConfig = {
  title: string;
  description: string;
};

export const PRODUCT_HEADER: Record<HeaderMode, HeaderConfig> = {
  list: {
    title: 'Products',
    description: 'Manage your product catalog',
  },
  create: {
    title: 'Create Product',
    description: 'Add a new product to the catalog',
  },
  edit: {
    title: 'Edit Product',
    description: 'Update product information',
  },
};
