#!/usr/bin/env node

/*
ISSUES:
- yarn build creates a static folder outside of dist/public in the dist folder
- FOUC on dev

TODO:
- Fork and quiet the logs of universal-hot-reload
- Update all package.json files
- Document the features
- Document the CLI
- Use auto-changelog
- Create CLI for web-generator and make sure to include all the manifest files too
  (with a link on how to generate them)
- When doing the CLI, make sure to also copy .gitignore, LICENSE, and README
- Publish initial version

FUTURE:
- Add support for metadata via page component (with extension capabilities)
- Add internationalization
- Add multi-domain deployment support (re: Hausing, allow strategy to be configurable)
- Add support for custom templates
- Write tests for everything
- Abstract away the server file from the user so that they don't need to have this in their project
- Support the ability for @carioca/server to use the existing code for building JS instead of babel-loader
- Add support for Preact with compat
- Allow custom ports for yarn start (spa)
- Allow port to be set via environment variable (maybe)
- Add prettier formatting and eslint to projects themselves
- Add support for content security policies: https://webpack.js.org/guides/csp/
- Add support for PWA's: https://webpack.js.org/guides/progressive-web-application/
- Support internationalization and also PWA's over multiple origins: https://web.dev/multi-origin-pwas/
- When supporting PWA's, make sure to provide functions for good installation UX: https://web.dev/promote-install/
- Upgrade to Webpack 5 when released
*/

// Require sade
const sade = require('sade');

// Require a helpful script for running commands
const { runCommand } = require('@carioca/utils');

// Require our package.json file
const pkg = require('./package.json');

// Define the sade script
const prog = sade('carioca');

// Add the version information to our sade CLI
prog.version(pkg.version);

// Add the build script
prog
  .command('build')
  .describe('Build the application')
  .option(
    '-e --env',
    'The environment you want to build (production or development)',
    'production'
  )
  .option('-m --mode', 'The mode you want to build as (ssr or spa)', 'ssr')
  .option('-p --port', 'The port where you want your application to run', 3000)
  .example('build --env development')
  .example('build --mode spa')
  .example('build --port 8000')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/build')].concat(process.argv.slice(3))
    );
  });

// Add the start script
prog
  .command('start')
  .describe('Run the built application - make sure to build first!')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/start')].concat(process.argv.slice(3))
    );
  });

// Add the development script (live-reload)
prog
  .command('dev')
  .describe('Start the application in development mode')
  .option('-m --mode', 'The mode you want to build as (ssr or spa)', 'ssr')
  .option('-p --port', 'The port where you want your application to run', 3000)
  .example('dev --mode spa')
  .example('dev --port 8000')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/dev')].concat(process.argv.slice(3))
    );
  });

// Add the test script
prog
  .command('test')
  .describe('Runs the test suite (supports all Jest CLI flags)')
  .example('test --watch')
  .example('test --coverage')
  .example('test --passWithNoTests --verbose')
  .action(() => {
    runCommand(
      'node',
      [require.resolve('./bin/test')].concat(process.argv.slice(3))
    );
  });

// Tell our CLI to parse the arguments it's given and we're off to the races!
prog.parse(process.argv);
