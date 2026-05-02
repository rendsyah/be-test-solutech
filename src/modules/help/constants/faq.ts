import type { FaqItem } from '../types';

export const HELP_FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'How do I change my password?',
    answer:
      'You can change your password by going to the Profile section in the top right corner, then clicking on "Change Password". For security reasons, we recommend using a combination of letters, numbers, and symbols.',
  },
  {
    id: '2',
    question: 'How do I manage user roles and permissions?',
    answer:
      'User roles can be managed in the Settings > Users section. Each role has specific permissions that determine what data a user can view or modify. You must have Administrator access to make these changes.',
  },
  {
    id: '3',
    question: 'Is my data secure and backed up?',
    answer:
      'Yes, all data is encrypted both in transit and at rest. We perform automated daily backups to ensure your information is safe and can be recovered in case of any system issues.',
  },
  {
    id: '4',
    question: 'How do I export data to Excel or CSV?',
    answer:
      'Navigate to the table you wish to export and look for the "Export" button in the top toolbar. You can choose your preferred format. Note that your permissions determine which data you are allowed to export.',
  },
  {
    id: '5',
    question: 'What happens when my session expires?',
    answer:
      'For your security, the system will automatically log you out after a period of inactivity. You will see a notification and will need to log in again to continue your work.',
  },
  {
    id: '6',
    question: 'What should I do if I encounter a bug?',
    answer:
      'Please take a screenshot of the error and open a support ticket using the "Open Support Ticket" button on this page. Include as much detail as possible about what you were doing when the error occurred.',
  },
];
