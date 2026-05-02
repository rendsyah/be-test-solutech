export const API = {
  ALLOWED_PATHS: ['audit', 'menus', 'permissions', 'roles', 'upload', 'users'],
  INVALID_PATH_PATTERNS: [
    '..', // Parent directory traversal
    '%2e%2e', // URL-encoded double dot
    '\0', // Null byte
    '\\', // Backslash
  ] as const,
} as const;
