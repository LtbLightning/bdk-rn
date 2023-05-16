module.exports = {
  rootDir: './',
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
