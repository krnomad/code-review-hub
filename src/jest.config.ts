export default {
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      '^.+\\.(css|less|scss)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
      '/node_modules/(?!lucide-react)/'  // lucide-react는 transform 대상에 포함
    ],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  };