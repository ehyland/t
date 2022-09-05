/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/jest/setup.ts'],
  moduleDirectories: ['node_modules', 'src'],
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|css)$':
      '<rootDir>/src/test-utils/jest/fileTransformer.js',
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
};
