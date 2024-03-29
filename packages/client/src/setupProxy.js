/* eslint-disable import/no-commonjs */
// eslint-disable-next-line import/no-extraneous-dependencies, @typescript-eslint/no-var-requires
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    proxy({
      target: process.env.REACT_APP_CLOUD_FUNCTIONS_URL,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    }),
  )
}
