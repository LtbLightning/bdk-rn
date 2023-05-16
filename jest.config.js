module.exports = {
  rootDir: './',
  preset: 'react-native',
  setupFiles: ['./__tests__/setup.ts'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
