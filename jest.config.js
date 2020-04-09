module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    modulePaths: ['src'],
    moduleNameMapper: {
        '^@music-data(.*)$': '<rootDir>/src/music-data/$1',
        '^@player(.*)$': '<rootDir>/src/player/$1',
        '^@common(.*)$': '<rootDir>/src/common/$1'
    }
};