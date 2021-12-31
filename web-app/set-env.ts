import ErrnoException = NodeJS.ErrnoException;

const writeFile = require('fs').writeFile;
const colors = require('colors');

// Load environment variables
require('dotenv').config();

// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.development.ts';

// `environment.ts` file structure
const envConfigFile = `export const environment = {
   production: false,
   apiBaseUrl: '${process.env['API_BASE_URL']}',
};
`;

console.log(colors.magenta(`The file \`${targetPath}\` will be written with the following content: \n`));
console.log(colors.grey(envConfigFile));

writeFile(targetPath, envConfigFile, function (err: ErrnoException) {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(colors.magenta(`Angular environment.ts file generated correctly at ${targetPath} \n`));
  }
});
