'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import {
  CurrencyInputValidation,
  FormCol,
  FormFieldValidation,
  InputValidation,
  SelectValidation,
} from '@/components/forms';
import { Button } from '@/components/ui';
import { useAlert } from '@/contexts';
import { useFormAction } from '@/hooks';
import type { ProductResponse } from '@/types';
import { productFormSchema, type ProductFormDto } from '@/validations';

import { productCreateAction, productUpdateAction } from '../actions';
import { PRODUCT_ROUTES, PRODUCT_STATUS_OPTIONS } from '../constants';
import { PRODUCT_KEY } from '../hooks';

type ProductFormProps = {
  mode: 'create' | 'edit';
  product?: ProductResponse;
};

const toFormValues = (product?: ProductResponse): ProductFormDto => ({
  id: product?.id,
  name: product?.name ?? '',
  description: product?.description ?? '',
  price: product?.price ?? '',
  stock: product?.stock ?? 0,
  status: product?.status ?? 'ACTIVE',
});

export const ProductForm: React.FC<ProductFormProps> = ({ mode, product }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();

  const isEdit = mode === 'edit';

  const action = isEdit ? productUpdateAction : productCreateAction;

  const { methods, handleSubmit, isPending } = useFormAction<ProductFormDto, unknown>(
    action,
    productFormSchema,
    {
      defaultValues: toFormValues(product),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY] });
        showAlert({
          variant: 'toast',
          type: 'success',
          title: 'Success',
          message: isEdit ? 'Product updated successfully' : 'Product created successfully',
        });
        router.push(PRODUCT_ROUTES.root);
      },
      onError: (message) => {
        showAlert({
          variant: 'modal',
          type: 'error',
          title: 'Failed',
          message,
        });
      },
    },
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
          <FormCol className="col-span-1">
            <FormFieldValidation name="name" label="Name" required>
              <InputValidation name="name" placeholder="Product name" />
            </FormFieldValidation>
          </FormCol>
          <FormCol className="col-span-1">
            <FormFieldValidation name="description" label="Description">
              <InputValidation name="description" placeholder="Product description" />
            </FormFieldValidation>
          </FormCol>
          <FormCol className="col-span-1">
            <FormFieldValidation name="price" label="Price" required>
              <CurrencyInputValidation name="price" placeholder="0" />
            </FormFieldValidation>
          </FormCol>
          <FormCol className="col-span-1">
            <FormFieldValidation name="stock" label="Stock" required>
              <InputValidation name="stock" inputMode="numeric" placeholder="0" />
            </FormFieldValidation>
          </FormCol>
          <FormCol className="col-span-1">
            <FormFieldValidation name="status" label="Status" required>
              <SelectValidation
                name="status"
                placeholder="Select Status"
                options={PRODUCT_STATUS_OPTIONS}
              />
            </FormFieldValidation>
          </FormCol>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button
            className="w-32"
            type="button"
            variant="outline"
            onClick={() => router.push(PRODUCT_ROUTES.root)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button className="w-32" type="submit" isLoading={isPending} disabled={isPending}>
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
