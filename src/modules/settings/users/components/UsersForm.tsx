import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import {
  FormCol,
  FormFieldValidation,
  InputValidation,
  RadioButton,
  RadioGroupValidation,
} from '@/components/forms';
import { EyeIcon, EyeSlashIcon, SaveIcon } from '@/components/icons';
import { Button, Section } from '@/components/ui';
import { useAlert, useResource } from '@/contexts';
import { useFormAction } from '@/hooks';
import type { ActionState, Options } from '@/types';

import { usersCreateAction, usersUpdateAction } from '../actions';
import {
  STATUS_OPTIONS,
  USERS_KEY,
  USERS_PERMISSIONS,
  USERS_ROUTES,
  type UsersFormMode,
} from '../constants';
import { usersFormSchema, type UsersFormDto } from '../validations';
import { RolesSection } from './roles';

type UsersFormProps = {
  mode: UsersFormMode;
  roles: Options[];
  defaultValues?: UsersFormDto;
};

export const UsersForm: React.FC<UsersFormProps> = ({ mode, roles, defaultValues }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { hasPermission } = useResource();
  const { showAlert } = useAlert();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isMode = {
    create: mode === 'create',
    detail: mode === 'detail',
    edit: mode === 'edit',
  };

  const action = (state: ActionState, dto: UsersFormDto) => {
    return isMode.edit ? usersUpdateAction(state, dto) : usersCreateAction(state, dto);
  };

  const canSubmit =
    (isMode.edit && hasPermission([USERS_PERMISSIONS.update])) ||
    (isMode.create && hasPermission([USERS_PERMISSIONS.create]));

  const { methods, handleSubmit, isPending } = useFormAction<UsersFormDto>(
    action,
    usersFormSchema,
    {
      defaultValues,
      omit: ['confirm_password'],
      onSuccess: async () => {
        const successMessage = isMode.edit
          ? 'User has been updated successfully'
          : 'User has been created successfully';

        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: successMessage,
        });

        await queryClient.invalidateQueries({ queryKey: [USERS_KEY] });
        router.push(USERS_ROUTES.root);
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
    router.push(USERS_ROUTES.root);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Section title="User Information">
          <div className="grid grid-cols-12 gap-6">
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="username" label="Username" required>
                <InputValidation
                  name="username"
                  placeholder="Enter Username"
                  readOnly={isMode.detail}
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="name" label="Name" required>
                <InputValidation name="name" placeholder="Enter Name" readOnly={isMode.detail} />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="email" label="Email Address" required>
                <InputValidation
                  name="email"
                  placeholder="Enter Email Address"
                  readOnly={isMode.detail}
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="phone" label="Phone Number" required>
                <InputValidation
                  name="phone"
                  placeholder="Enter Phone Number"
                  inputMode="numeric"
                  readOnly={isMode.detail}
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6" visible={isMode.create}>
              <FormFieldValidation name="password" label="Password" required>
                <InputValidation
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Password"
                  iconPosition="end"
                  icon={
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeIcon className="size-5" />
                      ) : (
                        <EyeSlashIcon className="size-5" />
                      )}
                    </div>
                  }
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6" visible={isMode.create}>
              <FormFieldValidation name="confirm_password" label="Confirm Password" required>
                <InputValidation
                  name="confirm_password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  iconPosition="end"
                  icon={
                    <div
                      className="cursor-pointer"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="size-5" />
                      ) : (
                        <EyeSlashIcon className="size-5" />
                      )}
                    </div>
                  }
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

        <RolesSection roles={roles} canSubmit={!isMode.detail && canSubmit} />

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
