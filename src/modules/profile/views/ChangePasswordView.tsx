'use client';

import React from 'react';

import { ChangePasswordForm, ProfileHeader } from '../components';

export const ChangePasswordView: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ProfileHeader mode="changePassword" />
      </div>
      <div className="col-span-12">
        <ChangePasswordForm />
      </div>
    </div>
  );
};
