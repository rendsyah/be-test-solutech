import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { FormCol, FormFieldValidation, InputValidation } from '@/components/forms';
import { CameraIcon, SaveIcon, CheckIcon } from '@/components/icons';
import { Button, Section } from '@/components/ui';
import { useAlert, useResource } from '@/contexts';
import { useFormAction, useUpload } from '@/hooks';
import { cn } from '@/libs/utils';

import { updateAccountAction } from '../actions';
import { updateAccountSchema, type UpdateAccountDto } from '../validations';

const ProgressRing: React.FC<{ percent: number }> = ({ percent }) => {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 144 144">
      {/* Track */}
      <circle
        cx="72"
        cy="72"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="4"
      />
      {/* Progress */}
      <circle
        cx="72"
        cy="72"
        r={radius}
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-300 ease-out"
      />
    </svg>
  );
};

export const AccountForm: React.FC = () => {
  const { user } = useResource();
  const { showAlert } = useAlert();
  const { uploading, percent, data, error, validate, onUpload } = useUpload();

  const [preview, setPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { methods, handleSubmit, isPending } = useFormAction<UpdateAccountDto>(
    updateAccountAction,
    updateAccountSchema,
    {
      defaultValues: {
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        image: user?.image || '',
      },
      onSuccess: () => {
        showAlert({
          variant: 'modal',
          type: 'success',
          title: 'Success',
          message: 'Account updated successfully',
        });
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

  const handleClickFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = validate(file);
    if (!isValid) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(String(reader.result));
      setImageKey((prev) => prev + 1);
    };
    reader.readAsDataURL(file);
    onUpload(file, 'users');
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    if (!data) return;
    methods.setValue('image', data);
    const timer = setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 0);
    return () => clearTimeout(timer);
  }, [methods, data]);

  const imageSrc = preview && !error ? preview : data || user?.image || '/images/avatar.svg';

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <Section title="Account Information">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-10">
                <div className="relative inline-block group">
                  <div className="relative size-36 rounded-full border-2 border-slate-200 overflow-hidden shadow-xs">
                    <Image
                      key={imageKey}
                      src={imageSrc}
                      alt="Profile"
                      fill
                      sizes="144px"
                      loading="eager"
                      className={cn(
                        'object-cover transition-opacity duration-500',
                        imageKey > 0 ? 'animate-fade-in' : '',
                      )}
                    />

                    <div
                      className={cn(
                        'absolute inset-0 flex flex-col items-center justify-center',
                        'transition-all duration-300',
                        uploading
                          ? 'opacity-100 bg-black/40 backdrop-blur-[2px]'
                          : 'opacity-0 pointer-events-none',
                      )}
                    >
                      <ProgressRing percent={percent} />
                      <span className="relative z-10 text-white text-sm font-semibold tabular-nums">
                        {percent}%
                      </span>
                    </div>

                    <div
                      className={cn(
                        'absolute inset-0 flex items-center justify-center',
                        'bg-black/40 backdrop-blur-[2px]',
                        'transition-all duration-500',
                        showSuccess ? 'opacity-100' : 'opacity-0 pointer-events-none',
                      )}
                    >
                      <CheckIcon className="size-10 text-white drop-shadow-md" />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClickFile}
                    disabled={uploading}
                    className={cn(
                      'absolute bottom-1 right-1 p-1.5 rounded-full border-2 border-white shadow-xs',
                      'bg-primary text-white',
                      'transition-all duration-200',
                      'hover:scale-110 active:scale-95',
                      uploading && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    <CameraIcon className="size-5" />
                  </button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleChangeFile}
                    disabled={uploading}
                  />
                </div>

                <div className="text-center sm:text-left">
                  <h2 className="font-semibold">Your Photo</h2>
                  <span className="block text-sm text-gray-400 mb-3">
                    This will be displayed on your profile.
                  </span>
                  <Button onClick={handleClickFile} isLoading={uploading} disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                </div>
              </div>
            </div>

            <FormCol className="col-span-12">
              <FormFieldValidation name="name" label="Full Name" required>
                <InputValidation name="name" placeholder="Enter Full Name" />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="email" label="Email Address" required>
                <InputValidation name="email" placeholder="Enter Email Address" type="email" />
              </FormFieldValidation>
            </FormCol>
            <FormCol className="col-span-12 sm:col-span-6">
              <FormFieldValidation name="phone" label="Phone Number" required>
                <InputValidation name="phone" placeholder="Enter Phone Number" />
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
                  disabled={isPending || uploading}
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
