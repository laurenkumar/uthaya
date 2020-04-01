import ready from 'domready';
import App from './scripts/App';
require("./index.scss");
require("../common/common.js");

ready(() => {
	window.app = new App();
	window.app.init();
});
