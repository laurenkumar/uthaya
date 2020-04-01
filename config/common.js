const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const __root = path.resolve(__dirname, '../');

const productionConfig = [{
    entry: {
        ateliers: './client/ateliers',
        cours: './client/cours',
        boutique: './client/boutique',
        home: './client/home',
        presentation: './client/presentation',
        traduction: './client/traduction'
    },
    output: {
        filename: './[name]/bundle.js',
        path: path.resolve(__dirname, '../public'),
        publicPath: '/'
    },
    mode: 'production',
    module: {
        rules: [
		{
			test: /\.js$/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					plugins: ['@babel/plugin-syntax-dynamic-import'],
                    plugins: ['@babel/plugin-proposal-class-properties']
				}
			},
			exclude: /node_modules/
		},
		{
			test: /\.(glsl|frag|vert)$/,
			use: ['glslify-import-loader', 'raw-loader', 'glslify-loader']
		},
		{
			test: /three\/examples\/js/,
			use: 'imports-loader?THREE=three'
		},
		{
			test: /\.scss$/,
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, {
                loader: 'css-loader'
            }, {
                loader: 'resolve-url-loader'
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                }
            }]
		},
		{
			test: /\.(woff|woff2|eot|ttf|otf)$/,
			use: 'file-loader'
		},
		{
			test: /\.(png|jpg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    context: 'client',
                    name: '[path][name].[ext]'
                }
            }]
		},
        {
            test: /\.glsl$/,
            use: [
              'raw-loader',
              'glslify-loader'
            ]
        }
		]
    },
    resolve: {
		alias: {
			'three-examples': path.join(__root, './node_modules/three/examples/js'),
		}
	},
    plugins: [
    	new webpack.ProvidePlugin({
			'THREE': 'three'
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: './[name]/index.css',
        })
    ]
}];

module.exports = productionConfig;