const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
    publicPath:'/',
    assetsDir:'static',
    devServer: {
        disableHostCheck: true
    },
    productionSourceMap: false,
    configureWebpack:{
        optimization: {
            minimizer: [
              new UglifyJsPlugin({
                uglifyOptions: {
                  warnings: false,
                  compress: {
                    drop_console: true,//console
                    drop_debugger: true,
                    pure_funcs: ['console.log']//移除console
                  }
                }
            })
          ]
        },
        plugins: [
            new CompressionWebpackPlugin({
                test:/\.js$|\.html$|\.css$/, //匹配文件名
                threshold: 10240,//对超过10k的数据压缩
                deleteOriginalAssets: false //不删除源文件
            })
        ]
    }
}