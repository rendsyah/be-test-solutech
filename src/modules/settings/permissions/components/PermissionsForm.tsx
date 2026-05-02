import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import {
  FormCol,
  FormFieldValidation,
  InputValidation,
  TextareaValidation,
} from '@/components/forms';
import { SaveIcon } from '@/components/icons';
import { Button, Section } from '@/components/ui';
import { useAlert } from '@/contexts';
import { useFormAction } from '@/hooks';

import { permissionsCreateAction } from '../actions';
import { PERMISSIONS_KEY, PERMISSIONS_ROUTES } from '../constants';
import { permissionsFormSchema, type PermissionsFormDto } from '../validations';

type PermissionsFormProps = {
  mode: 'create' | 'detail';
  defaultValues?: PermissionsFormDto;
};

export const PermissionsForm: React.FC<PermissionsFormProps> = ({ mode, defaultValues }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { showAlert } = useAlert();

  const isMode = {
    create: mode === 'create',
    detail: mode === 'detail',
  };

  const canSubmit = isMode.create;

  const { methods, handleSubmit, isPending } = useFormAction<PermissionsFormDto>(
    permissionsCreateAction,
    permissionsFormSchema,
    {
      defaultValues,
      onSuccess: async () => {
        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: 'Permission has been created successfully',
        });

        await queryClient.invalidateQueries({ queryKey: [PERMISSIONS_KEY] });
        router.push(PERMISSIONS_ROUTES.root);
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

  const handleCancel = () => {
    router.push(PERMISSIONS_ROUTES.root);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <Section title="Permission Information">
          <div className="grid grid-cols-12 gap-6">
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="name" label="Name" required>
                <InputValidation name="name" placeholder="Enter Name" readOnly={isMode.detail} />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="key" label="Key" required>
                <InputValidation
                  name="key"
                  placeholder="Enter Key e.g. dashboard.view"
                  readOnly={isMode.detail}
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12">
              <FormFieldValidation name="description" label="Description" required>
                <TextareaValidation
                  name="description"
                  placeholder="Enter Description"
                  readOnly={isMode.detail}
                />
              </FormFieldValidation>
            </FormCol>
            {canSubmit && (
              <div className="col-span-12">
                <div className="flex items-center justify-end gap-4">
                  <Button className="w-full sm:w-32" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-32"
                    isLoading={isPending}
                    disabled={isPending}
                    icon={<SaveIcon />}
                    iconPosition="start"
                  >
                    {isPending ? 'Loading...' : 'Save'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Section>
      </form>
    </FormProvider>
  );
};
