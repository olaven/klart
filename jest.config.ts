import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
