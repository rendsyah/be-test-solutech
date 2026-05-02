import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';

import {
  FormCol,
  FormFieldValidation,
  InputValidation,
  SelectValidation,
  TextareaValidation,
} from '@/components/forms';
import { SaveIcon } from '@/components/icons';
import { Button, Section } from '@/components/ui';
import { useAlert, useResource } from '@/contexts';
import { useFormAction } from '@/hooks';
import type { Options } from '@/types';

import { menusUpdateAction } from '../actions';
import { MENUS_KEY, MENUS_PERMISSIONS } from '../constants';
import type { MenusOptionsResponse } from '../types';
import { menusUpdateSchema, type MenusUpdateDto } from '../validations';
import { PermissionsSection } from './permissions';

type MenusFormProps = {
  menus: MenusOptionsResponse[];
  permissions: Options[];
  defaultValues?: MenusUpdateDto;
};

export const MenusForm: React.FC<MenusFormProps> = ({ menus, permissions, defaultValues }) => {
  const queryClient = useQueryClient();

  const { hasPermission } = useResource();
  const { showAlert } = useAlert();

  const canSubmit = hasPermission([MENUS_PERMISSIONS.update]);

  const { methods, handleSubmit, isPending } = useFormAction<MenusUpdateDto>(
    menusUpdateAction,
    menusUpdateSchema,
    {
      defaultValues,
      onSuccess: async () => {
        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: 'Menu has been updated successfully',
        });

        await queryClient.invalidateQueries({ queryKey: [MENUS_KEY] });
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
    methods.reset();
  };

  useEffect(() => {
    if (defaultValues) {
      methods.reset(defaultValues);
    }
  }, [defaultValues, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Section title="Menu Information">
          <div className="grid grid-cols-12 gap-6">
            <FormCol className="col-span-12">
              <FormFieldValidation name="name" label="Name" required>
                <InputValidation name="name" placeholder="Enter Name" readOnly={!canSubmit} />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12">
              <FormFieldValidation name="description" label="Description" required>
                <TextareaValidation
                  name="description"
                  placeholder="Enter Description"
                  readOnly={!canSubmit}
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="sort" label="Sort" required>
                <InputValidation
                  name="sort"
                  inputMode="numeric"
                  placeholder="Enter Sort"
                  readOnly={!canSubmit}
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="parent_id" label="Parent">
                <SelectValidation
                  name="parent_id"
                  placeholder="Choose Parent"
                  options={menus}
                  readOnly={!canSubmit}
                />
              </FormFieldValidation>
            </FormCol>
          </div>
        </Section>

        <PermissionsSection permissions={permissions} canSubmit={canSubmit} />

        {canSubmit && (
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
        )}
      </form>
    </FormProvider>
  );
};
