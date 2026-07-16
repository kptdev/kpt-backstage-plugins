const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, 'src'),
  testEnvironment: require.resolve('@backstage/cli-module-test-jest/config/jest-environment-jsdom'),
  runtime: require.resolve('@backstage/cli-module-test-jest/config/jestCachingModuleLoader'),
  displayName: '@kpt/backstage-plugin-cad',
  setupFiles: [path.resolve(__dirname, '../../jest.setup.js')],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testMatch: ['**/*.test.{js,jsx,ts,tsx,mjs,cjs}'],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': require.resolve('jest-css-modules'),
    '^monaco-editor$': path.resolve(__dirname, '../../__mocks__/monaco-editor.ts'),
    '^monaco-editor/(.*)$': path.resolve(__dirname, '../../__mocks__/monaco-editor.ts'),
    '^@monaco-editor/react$': path.resolve(__dirname, '../../__mocks__/@monaco-editor/react.js'),
  },
  transform: {
    '\\.(mjs|cjs|js)$': [
      require.resolve('@backstage/cli-module-test-jest/config/jestSwcTransform'),
      { jsc: { parser: { syntax: 'ecmascript' } } },
    ],
    '\\.jsx$': [
      require.resolve('@backstage/cli-module-test-jest/config/jestSwcTransform'),
      { jsc: { parser: { syntax: 'ecmascript', jsx: true }, transform: { react: { runtime: 'automatic' } } } },
    ],
    '\\.(mts|cts|ts)$': [
      require.resolve('@backstage/cli-module-test-jest/config/jestSwcTransform'),
      { jsc: { parser: { syntax: 'typescript' } } },
    ],
    '\\.tsx$': [
      require.resolve('@backstage/cli-module-test-jest/config/jestSwcTransform'),
      { jsc: { parser: { syntax: 'typescript', tsx: true }, transform: { react: { runtime: 'automatic' } } } },
    ],
    '\\.(bmp|gif|jpg|jpeg|png|ico|webp|frag|xml|svg|eot|woff|woff2|ttf)$':
      require.resolve('@backstage/cli-module-test-jest/config/jestFileTransform.js'),
    '\\.(yaml)$': require.resolve('@backstage/cli-module-test-jest/config/jestYamlTransform'),
  },
  transformIgnorePatterns: [
    '/node_modules/(?:@material-ui|ajv|core-js|jest-.*|jsdom|knex|react|react-dom|highlight\\.js|prismjs|json-schema|react-use/lib|typescript)/',
  ],
};
