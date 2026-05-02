'use client';

import { useMemo } from 'react';
import { UAParser } from 'ua-parser-js';

type DeviceInfo = {
  firebase_id: string;
  device_browser: string;
  device_browser_version: string;
  device_imei: string;
  device_model: string;
  device_type: string;
  device_vendor: string;
  device_os: string;
  device_os_version: string;
  device_platform: string;
  user_agent: string;
  app_version: string;
};

export const useDevice = (): DeviceInfo => {
  return useMemo(() => {
    const { browser, os, device: uaDevice, ua } = UAParser();
    return {
      firebase_id: '',
      device_browser: browser.name ?? 'Unknown',
      device_browser_version: browser.version ?? '',
      device_imei: '',
      device_model: uaDevice.model ?? '',
      device_type: uaDevice.type ?? 'desktop',
      device_vendor: uaDevice.vendor ?? '',
      device_os: os.name ?? 'Unknown',
      device_os_version: os.version ?? '',
      device_platform: 'Web',
      user_agent: ua,
      app_version: '1.0.0',
    };
  }, []);
};
