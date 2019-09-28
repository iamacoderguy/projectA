module.exports = {
  root: true,
  rules: {
    'react/jsx-filename-extension': 0,
    'import/no-unresolved': 'off',
    'function-paren-newline': ['error', 'consistent'],
    'react/prefer-stateless-function': 'off',
    'consistent-return': 'off',
    'no-shadow': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-destructuring': [
      'error',
      {
        array: false,
        object: false,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    'no-unused-expressions': 'off',
    'no-param-reassign': [
      2,
      {
        props: false,
      },
    ],
    'react/forbid-prop-types': 0,
    'arrow-parens': 'off',
    'class-methods-use-this': 0,
    'global-require': 'off',
    'no-return-assign': 'off',
    'prefer-template': 'off',
    'no-underscore-dangle': 'off',
    'no-plusplus': 'off',
    'no-else-return': 'off',
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'disableYellowBox'],
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
    jest: true,
  },
  globals: {
    shallow: true,
    render: true,
    mount: true,
    renderer: true,
    act: true,
    cleanup: true,
    fireEvent: true,
    wait: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
};
