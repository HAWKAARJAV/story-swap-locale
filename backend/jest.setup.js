// Jest setup file: mock problematic ESM modules or global test hooks.
// Mock uuid v4 to avoid ESM interop issues in Jest CommonJS context.
jest.mock('uuid', () => ({ v4: () => '00000000-0000-4000-8000-000000000000' }));

// Optionally silence noisy logs during tests; uncomment if desired.
// const originalError = console.error;
// console.error = (...args) => {
//   if (/DeprecationWarning/.test(args[0])) return;
//   originalError(...args);
// };
