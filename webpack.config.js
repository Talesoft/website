
const {resolve} = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");


module.exports = env =>
{
    env = Object.assign({
        APP_ENV: 'development'
    }, env || {});

    const options = {
        mode: env.APP_ENV,
        devtool: env.APP_ENV === 'development' ? 'inline-source-map ' : undefined,
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
                publicPath: '/'
            },
            module: Object.assign({}, options.module, {
                rules: [
                    ...options.module.rules,
                    {
                        test: /\.s?css$/,
                        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
                    },
                    {
                        test: /\.(eot|woff2?|ttf|svg)$/,
                        use: [{
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/'
                            }
                        }]
                    }
                ]
            }),
            plugins: [
                new MiniCssExtractPlugin({
                    filename: 'index.css'
                }),
                new OptimizeCSSAssetsPlugin({})
            ],
            optimization: {
                minimizer: [new TerserPlugin()],
            },
        }),
    ];
};
