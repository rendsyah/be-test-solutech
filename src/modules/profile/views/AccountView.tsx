'use client';

import React from 'react';

import { AccountForm, ProfileHeader } from '../components';

export const AccountView: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12">
        <ProfileHeader mode="account" />
      </div>
      <div className="col-span-12">
        <AccountForm />
      </div>
    </div>
  );
};
