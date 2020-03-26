'use strict';

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const keys = require('./keys_dev.js');

const __root = path.resolve(__dirname, '../');

module.exports = {
	entry: {
		index: [path.join(__dirname, '../src/scripts/index.js')],
		traduction: [path.join(__dirname, '../src/scripts/traduction.js')],		
	},
	output: {
		filename: 'scripts/[name].js',
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env'],
					plugins: ['@babel/plugin-syntax-dynamic-import']
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
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader, 'css-loader', 'style-loader']
		},
		{
			test: /\.(woff|woff2|eot|ttf|otf)$/,
			use: 'file-loader'
		},
		{
			test: /\.(jpe?g|png|gif)$/i,
			use: 'file-loader'
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
			$: 'jquery',
			jQuery: 'jquery',
		}),
		new CleanWebpackPlugin(
			['dist'],
			{ root: __root },
			),
		new CopyWebpackPlugin([
		{
			from: path.resolve(__root, 'static'),
		}
		]),
		new HtmlWebpackPlugin(
			{
				filename: 'index.html',
				chunks: ['index'],
				template: './src/index.html',
			}
		),
		new HtmlWebpackPlugin(
			{
				filename: 'traduction.html',
				chunks: ['traduction', 'index'],
				template: './src/traduction.html',
			}
		),
		new webpack.ProvidePlugin({
			'THREE': 'three'
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new MiniCssExtractPlugin()
	]
};
