const path              = require('path')
const fs                = require('fs')
const autoprefixer      = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

// 入口
const entrys = function () {
    let components = {}
    // 读取components下所有的文件夹
    const files = fs.readdirSync('./src/components')
    files.forEach(function (item, index) {
        // 转换为fd格式
        let stat = fs.lstatSync("./src/components/" + item)
        // 判断目标是否为文件夹？
        if (stat.isDirectory() === true) { 
            // 如果是文件夹，那么将路径加入到入口对象中
            components[item] = [path.resolve(__dirname, `src/components/${item}/index.js`)]
        }
    })
    return components;
}()

module.exports = {
    devtool: 'source-map',
    entry: entrys,
    output: {
        // 输出文件的路径（如果开启webpack-dev-server，那么会无视这个属性）
        path: path.resolve(__dirname, 'dist'),
        // 为从 entry 中配置生成的 Chunk 配置输出文件的名称
        filename: '[name].js',
        // 为动态加载的 Chunk 配置输出文件的名称
        chunkFilename: '[name].js',
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
            }
        ]
    },
    plugins: [
        new CommonsChunkPlugin({
          chunks: ['a', 'b'],  
          // 提取出的公共部分形成一个新的 Chunk，这个新 Chunk 的名称
          name: 'common'
        })
    ],
    resolve: {
         extensions: ['.js', '.json', '.scss'],
         alias: {
             '@': path.resolve(__dirname, 'src'),
             '@scss': path.resolve(__dirname, 'src', 'scss'),
         }
    },
}