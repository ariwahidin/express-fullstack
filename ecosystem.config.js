module.exports = {
    apps: [
      {
        name: 'py-express',
        script: './app.js',
        watch: true,
        ignore_watch: ['node_modules', 'logs'],
        // env: {
        //   NODE_ENV: 'development',
        // },
        // env_production: {
        //   NODE_ENV: 'production',
        // },
        node_args: '--inspect',
      },
    ],
  };