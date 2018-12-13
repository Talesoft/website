
const {resolve} = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


module.exports = env =>
{
    env = Object.assign({
        APP_ENV: 'development'
    }, env || {});

    const options = {
        mode: env.APP_ENV,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        }
    };

    return [
        //Backend
        Object.assign({}, options, {
            target: 'node',
            entry: resolve(__dirname, 'src', 'backend', 'index.ts'),
            node: {
                __dirname: false
            },
            output: {
                filename: 'index.js',
                path: resolve(__dirname, 'bundle')
            }
        }),

        //Frontend
        Object.assign({}, options, {
            target: 'web',
            entry: resolve(__dirname, 'src', 'frontend', 'index.ts'),
            output: {
                filename: 'index.js',
                path: resolve(__dirname, 'public'),
                publicPath: resolve(__dirname, 'public')
            },
            module: Object.assign({}, options.module, {
                rules: [
                    ...options.module.rules,
                    {
                        test: /\.s?css$/,
                        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                    }
                ]
            }),
            plugins: [
                new MiniCssExtractPlugin({
                    filename: 'index.css'
                }),
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: env.APP_ENV === 'development'
                }),
                new OptimizeCSSAssetsPlugin({})
            ],
        }),
    ];
};
