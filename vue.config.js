const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  publicPath: '/',
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8080,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
	        '^/api': ''
	    	}
      }
    }
  },
  configureWebpack: ({
    optimization: {
      minimizer: [
        new TerserPlugin({
          sourceMap: false,
          terserOptions: {
            compress: {
              warnings: false,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.warn', 'console.error']
            }
          }
        })
      ]
    }
  })
}
