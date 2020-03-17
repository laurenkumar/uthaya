const merge = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, {
	mode: 'production',
	devServer: {
	    disableHostCheck: true,
	    host: '0.0.0.0',
	    port: 8081
	}
});
