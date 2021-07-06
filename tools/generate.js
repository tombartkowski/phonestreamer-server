const { generateTemplateFiles } = require('generate-template-files');

generateTemplateFiles([
  {
    option: 'Create a Resource',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './tools/templates/resources/',
    },
    stringReplacers: [{ question: 'Entity name:', slot: '__entity__' }],
    output: {
      path: './src/resources/__entity__(camelCase)s/',
      pathAndFileNameDefaultCase: '(camelCase)',
    },
    onComplete: results => {
      console.log(results);
    },
  },
  {
    option: 'Create a Value Object',
    defaultCase: '(pascalCase)',
    entry: {
      folderPath: './tools/templates/valueObjects/__entity____valueObject__.ts',
    },
    stringReplacers: [
      { question: 'Entity name:', slot: '__entity__' },
      { question: 'Value Object name:', slot: '__valueObject__' },
    ],
    output: {
      path: './src/resources/__entity__(camelCase)s/valueObjects/__entity__(camelCase)__valueObject__(pascalCase).ts',
      pathAndFileNameDefaultCase: '(camelCase)',
    },
    onComplete: results => {
      console.log(results);
    },
  },
]);
