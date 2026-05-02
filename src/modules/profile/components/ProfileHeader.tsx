import React from 'react';

import { Breadcrumb } from '@/components/ui';

import { PROFILE_HEADER, type ProfileHeaderMode } from '../constants';

type ProfileHeaderProps = {
  mode: ProfileHeaderMode;
};

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ mode }) => {
  const { breadcrumb, title, description } = PROFILE_HEADER[mode];

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-">
      <div className="flex flex-col">
        <Breadcrumb items={breadcrumb} />
        <h1 className="text-2xl font-semibold mt-2">{title}</h1>
        <p className="text-sm text-gray-400 font-medium">{description}</p>
      </div>
    </div>
  );
};
