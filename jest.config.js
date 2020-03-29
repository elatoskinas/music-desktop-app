module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePaths: ['src'],
    moduleNameMapper: {
        '^@music-data(.*)$': '<rootDir>/src/music-data/$1'
    }
};