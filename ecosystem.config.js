module.exports = {
  apps: [
    {
      name: 'dick-tg-bot',
      script: './dist/dick-tg-bot/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
