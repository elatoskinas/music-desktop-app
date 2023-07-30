module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    modulePaths: ['src'],
    moduleNameMapper: {
        '^@data(.*)$': '<rootDir>/src/data/$1',
        '^@backend(.*)$': '<rootDir>/src/backend/$1',
        '^@frontend(.*)$': '<rootDir>/src/frontend/$1',
        '^@common(.*)$': '<rootDir>/src/common/$1',
        '\\.(css|less)$': 'identity-obj-proxy'
    }
};