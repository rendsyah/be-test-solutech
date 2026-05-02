import fs from 'fs';
import path from 'path';

const modulePathInput = process.argv[2];

if (!modulePathInput) {
  console.error('Please provide a module name (e.g., node scripts/gen-module.mjs settings/users)');
  process.exit(1);
}

// Normalize path separators and split
const pathSegments = modulePathInput.split(/[\\/]/).filter(Boolean);
const folderName = pathSegments.join('/'); // settings/users
const leafName = pathSegments[pathSegments.length - 1]; // users
const parentName = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : null;

// Convert leafName to PascalCase for component names
const toPascalCase = (str) => {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const pascalName = toPascalCase(leafName);
const modulePath = path.join(process.cwd(), 'src', 'modules', folderName);
const varPrefix = leafName.toUpperCase().replace(/[-]/g, '_');

const folders = [
  'actions',
  'components',
  'constants',
  'helpers',
  'hooks',
  'services',
  'types',
  'validations',
  'views',
];

// 1. Create Directories
if (fs.existsSync(modulePath)) {
  console.error(`Module "${folderName}" already exists at ${modulePath}`);
  process.exit(1);
}

fs.mkdirSync(modulePath, { recursive: true });

folders.forEach((folder) => {
  const folderPath = path.join(modulePath, folder);
  fs.mkdirSync(folderPath, { recursive: true });

  if (folder === 'services') {
    // Special case for services: client and server subfolders
    const clientPath = path.join(folderPath, 'client');
    const serverPath = path.join(folderPath, 'server');
    fs.mkdirSync(clientPath, { recursive: true });
    fs.mkdirSync(serverPath, { recursive: true });
    fs.writeFileSync(path.join(clientPath, 'index.ts'), 'export {};\n');
    fs.writeFileSync(path.join(serverPath, 'index.ts'), 'export {};\n');
  } else if (folder === 'constants') {
    // Boilerplate constants
    const routesContent = `export const ${varPrefix}_ROUTES = {\n  root: '/${folderName.replace(/\\/g, '/')}',\n};\n`;

    // Smart breadcrumb
    const parentLabel = parentName ? toPascalCase(parentName) : 'Dashboard';
    const parentHref = parentName ? '#' : '/dashboard';

    const headerContent = `import { ${varPrefix}_ROUTES } from './routes';\n\nconst base = [{ label: '${parentLabel}', href: '${parentHref}' }, { label: '${pascalName}', href: ${varPrefix}_ROUTES.root }];\n\nexport const ${varPrefix}_HEADER = {\n  main: {\n    title: '${pascalName}',\n    description: 'Manage and monitor your ${leafName} information.',\n    breadcrumb: base,\n  },\n} as const;\n\nexport type ${pascalName}HeaderMode = keyof typeof ${varPrefix}_HEADER;\n`;

    fs.writeFileSync(path.join(folderPath, 'routes.ts'), routesContent);
    fs.writeFileSync(path.join(folderPath, 'header.ts'), headerContent);

    // Add permissions.ts as well since it's common
    fs.writeFileSync(
      path.join(folderPath, 'permissions.ts'),
      `export const ${varPrefix}_PERMISSIONS = {\n  view: '${leafName}.view',\n  create: '${leafName}.create',\n  update: '${leafName}.update',\n};\n`,
    );

    fs.writeFileSync(
      path.join(folderPath, 'index.ts'),
      "export * from './header';\nexport * from './routes';\nexport * from './permissions';\n",
    );
  } else if (folder === 'views') {
    // Boilerplate view
    const viewContent = `'use client';\n\n// import { ${pascalName}Header } from '../components';\n\nexport const ${pascalName}View = () => {\n  return (\n    <div className="grid grid-cols-12 gap-6">\n      <div className="col-span-12">\n        {/* <${pascalName}Header /> */}\n      </div>\n    </div>\n  );\n};\n`;
    fs.writeFileSync(path.join(folderPath, `${pascalName}View.tsx`), viewContent);
    fs.writeFileSync(path.join(folderPath, 'index.ts'), `export * from './${pascalName}View';\n`);
  } else {
    // Default index.ts with export {};
    fs.writeFileSync(path.join(folderPath, 'index.ts'), 'export {};\n');
  }
});

// 2. Generate Root Index
const rootIndexContent = `export * from './services/client';\nexport * from './services/server';\nexport * from './types';\nexport * from './views';\n`;
fs.writeFileSync(path.join(modulePath, 'index.ts'), rootIndexContent);

console.log(`\n✅ Module "${folderName}" generated successfully at src/modules/${folderName}`);
