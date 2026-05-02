import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import {
  FormCol,
  FormFieldValidation,
  InputValidation,
  RadioButton,
  RadioGroupValidation,
  TextareaValidation,
} from '@/components/forms';
import { SaveIcon } from '@/components/icons';
import { Badge, Button, Section } from '@/components/ui';
import { useAlert, useResource } from '@/contexts';
import { useFormAction } from '@/hooks';
import type { ActionState } from '@/types';

import type { PermissionsResponse } from '../../permissions';
import { rolesCreateAction, rolesUpdateAction } from '../actions';
import {
  ROLES_KEY,
  ROLES_PERMISSIONS,
  ROLES_ROUTES,
  STATUS_OPTIONS,
  type RolesFormMode,
} from '../constants';
import { useRolesForm } from '../hooks';
import { type RolesFormDto, rolesFormSchema } from '../validations';
import { ModuleRow } from './module';

type RolesFormProps = {
  mode: RolesFormMode;
  permissions: PermissionsResponse[];
  defaultValues?: RolesFormDto;
};

export const RolesForm: React.FC<RolesFormProps> = ({ mode, permissions, defaultValues }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { hasPermission } = useResource();
  const { showAlert } = useAlert();
  const {
    menuIds,
    selectedPermissionIds,
    totalPermissions,
    onTogglePermission,
    onToggleAllPermissions,
  } = useRolesForm(permissions, defaultValues);

  const isMode = {
    create: mode === 'create',
    detail: mode === 'detail',
    edit: mode === 'edit',
  };

  const action = (state: ActionState, dto: RolesFormDto) => {
    return isMode.edit ? rolesUpdateAction(state, dto) : rolesCreateAction(state, dto);
  };

  const canSubmit =
    (isMode.edit && hasPermission([ROLES_PERMISSIONS.update])) ||
    (isMode.create && hasPermission([ROLES_PERMISSIONS.create]));

  const { methods, handleSubmit, isPending } = useFormAction<RolesFormDto>(
    action,
    rolesFormSchema,
    {
      defaultValues,
      transform: (values) => {
        return {
          ...values,
          menus: menuIds,
          permissions: Array.from(selectedPermissionIds),
        };
      },
      onSuccess: async () => {
        const successMessage = isMode.edit
          ? 'Role has been updated successfully'
          : 'Role has been created successfully';

        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: successMessage,
        });

        await queryClient.invalidateQueries({ queryKey: [ROLES_KEY] });
        router.push(ROLES_ROUTES.root);
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
    router.push(ROLES_ROUTES.root);
  };

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <Section title="Role Information">
          <div className="grid grid-cols-12 gap-6">
            <FormCol className="col-span-12">
              <FormFieldValidation name="name" label="Name" required>
                <InputValidation name="name" placeholder="Enter Name" readOnly={isMode.detail} />
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
            <FormCol className="col-span-12" visible={!isMode.create}>
              <FormFieldValidation name="status" label="Status" required asFieldset>
                <RadioGroupValidation name="status" direction="row">
                  {STATUS_OPTIONS.map((status) => (
                    <RadioButton
                      key={status.id}
                      label={status.name}
                      value={status.id}
                      readOnly={isMode.detail}
                    />
                  ))}
                </RadioGroupValidation>
              </FormFieldValidation>
            </FormCol>
          </div>
        </Section>
        <Section
          title="Permission Configuration"
          contentClassName="p-0"
          headerExtra={
            <Badge color="info" size="sm">
              {selectedPermissionIds.size} / {totalPermissions} Selected
            </Badge>
          }
        >
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              {permissions.map((module, i) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  selectedPermissionIds={selectedPermissionIds}
                  onTogglePermission={onTogglePermission}
                  onToggleAllPermissions={onToggleAllPermissions}
                  level={0}
                  isLast={i === permissions.length - 1}
                  readOnly={isMode.detail}
                />
              ))}
            </div>
          </div>
          {canSubmit && (
            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-end gap-4">
                <Button variant="outline" className="w-full sm:w-32" onClick={handleCancel}>
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
        </Section>
      </form>
    </FormProvider>
  );
};
