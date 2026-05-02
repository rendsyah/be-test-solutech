import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormCol, FormFieldValidation, InputValidation } from '@/components/forms';
import { EyeIcon, EyeSlashIcon, SaveIcon } from '@/components/icons';
import { Button, Section } from '@/components/ui';
import { useAlert } from '@/contexts';
import { useFormAction } from '@/hooks';

import { changePasswordAction } from '../actions';
import { changePasswordSchema, type ChangePasswordDto } from '../validations';

export const ChangePasswordForm: React.FC = () => {
  const { showAlert } = useAlert();
  const router = useRouter();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);

  const { methods, handleSubmit, isPending } = useFormAction<ChangePasswordDto>(
    changePasswordAction,
    changePasswordSchema,
    {
      omit: ['confirm_password'],
      onSuccess: () => {
        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: 'Password changed successfully',
        });
        methods.reset();
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
    router.back();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <Section title="Change Password">
          <div className="grid grid-cols-12 gap-6">
            <FormCol className="col-span-12">
              <FormFieldValidation name="old_password" label="Old Password" required>
                <InputValidation
                  name="old_password"
                  placeholder="Enter Old Password"
                  type={showOldPassword ? 'text' : 'password'}
                  iconPosition="end"
                  icon={
                    <button type="button" onClick={() => setShowOldPassword(!showOldPassword)}>
                      {showOldPassword ? (
                        <EyeIcon className="size-5" />
                      ) : (
                        <EyeSlashIcon className="size-5" />
                      )}
                    </button>
                  }
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="new_password" label="New Password" required>
                <InputValidation
                  name="new_password"
                  placeholder="Enter New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  iconPosition="end"
                  icon={
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? (
                        <EyeIcon className="size-5" />
                      ) : (
                        <EyeSlashIcon className="size-5" />
                      )}
                    </button>
                  }
                />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="confirm_password" label="Confirm Password" required>
                <InputValidation
                  name="confirm_password"
                  placeholder="Confirm New Password"
                  type={showRetypePassword ? 'text' : 'password'}
                  iconPosition="end"
                  icon={
                    <button
                      type="button"
                      onClick={() => setShowRetypePassword(!showRetypePassword)}
                    >
                      {showRetypePassword ? (
                        <EyeIcon className="size-5" />
                      ) : (
                        <EyeSlashIcon className="size-5" />
                      )}
                    </button>
                  }
                />
              </FormFieldValidation>
            </FormCol>
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
          </div>
        </Section>
      </form>
    </FormProvider>
  );
};
