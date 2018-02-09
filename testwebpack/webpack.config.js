const path              = require('path')
const fs                = require('fs')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer      = require('autoprefixer')

const entrys = function () {
    let components = {}
    const files = fs.readdirSync('./components')
    files.forEach(function (item, index) {
        let stat = fs.lstatSync("./components/" + item)
        if (stat.isDirectory() === true) { 
            components[item] = path.resolve(__dirname, 'components', item, 'index.js')
        }
    })
    return components;
}()

module.exports = {
    devtool: 'source-map',
    entry: entrys,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
               test: /\.vue$/,
               loader: 'vue-loader',
            },
            {
              test: /\.js$/,
              exclude: /node_modules/, 
              use: ['babel-loader'],
            },
            {
                test: /\.(scss|sass|css)$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    {
                      loader: 'postcss-loader',
                      options: {
                        sourceMap: true,
                        plugins: () => [autoprefixer({ browsers: ['iOS >= 7', 'Android >= 4.1'] })],
                      },
                    },
                    {
                       loader: 'sass-loader',
                       query: {
                         sourceMap: true
                       }
                    }
               ]
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'application/font-woff',
                },
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'application/octet-stream',
                },
            },
            { 
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'application/vnd.ms-fontobject',
                },
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    minetype: 'image/svg+xml',
                },
            },
            {
                test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                },
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin('assets/css/[name].css')
    ]
}