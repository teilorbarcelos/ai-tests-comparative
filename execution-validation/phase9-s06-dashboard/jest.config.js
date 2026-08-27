module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/tests/styleMock.js',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { module: 'CommonJS', jsx: 'react-jsx' } }],
  },
};