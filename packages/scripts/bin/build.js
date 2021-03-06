const webpack = require('webpack');
const {
  createConfig,
  definePaths,
  info,
  error,
  success,
} = require('@carioca/utils');

module.exports = (env, mode, port) => {
  // Handle compilation errors
  const handleErrors = (target, err, stats) => {
    if (err || stats.hasErrors()) {
      if (err) {
        error(`Fatal error when compiling the ${target}`, err.stack || err);

        if (err.details) {
          error('More details...', err.details);
        }

        return;
      }

      if (stats) {
        const info = stats.toJson();

        if (stats.hasErrors()) {
          info.errors.forEach((error) => {
            console.log(error);
          });
        }

        if (stats.hasWarnings()) {
          info.warnings.forEach((warning) => {
            console.log(warning);
          });
        }
      }
    }
  };

  // Define a simple compiler function to DRY things up
  const compile = (config, target) => {
    let compiler;

    try {
      compiler = webpack(config);
    } catch (err) {
      handleErrors(target, err);
      process.exit(1);
    }

    return compiler;
  };

  // What to call when we're done
  const onFinish = () =>
    success(
      `${
        env.charAt(0).toUpperCase() + env.slice(1)
      } ${mode.toUpperCase()} build complete`
    );

  // Determine all of our paths
  info('Defining the paths to your application...');
  const paths = definePaths();

  // Create the client-side Webpack config and put it in the compiler
  info(`Creating the configuration for the client...`);
  const clientConfig = createConfig({
    target: 'web',
    intention: 'build',
    env,
    mode,
    port,
    paths,
  });
  const clientCompiler = compile(clientConfig, 'client');

  // Run the client-side compiler
  clientCompiler.run((err, stats) => {
    handleErrors('client', err, stats);

    success('Done compiling client!');

    if (mode === 'spa') onFinish();
    else {
      // Create the server-side Webpack config and put it in the compiler
      info(`Creating the configuration for the server...`);
      const serverConfig = createConfig({
        target: 'node',
        intention: 'build',
        env,
        mode,
        port,
        paths,
      });
      const serverCompiler = compile(serverConfig, 'server');

      // Run the server-side compiler
      serverCompiler.run((err, stats) => {
        handleErrors('client', err, stats);

        success('Done compiling server!');
        onFinish();
      });
    }
  });
};
