import WebGLView from './webgl/WebGLView';
import GUIView from './gui/GUIView';
import "intersection-observer";
import TextOnPath from "./utils/textOnPath";


export default class App {

	constructor() {

	}

	init() {
		this.initWebGL();
		this.initGUI();
		this.addListeners();
		this.animate();
		this.resize();
	}

	initWebGL() {
		this.webgl = new WebGLView(this);
		document.querySelector('.container').appendChild(this.webgl.renderer.domElement);
	}

	initGUI() {
		this.gui = new GUIView(this);
	}

	addListeners() {
		this.handlerAnimate = this.animate.bind(this);

		window.addEventListener('resize', this.resize.bind(this));
		window.addEventListener('keyup', this.keyup.bind(this));

		const el = this.webgl.renderer.domElement;
		el.addEventListener('click', this.click.bind(this));

		const toogleLinks = document.querySelectorAll('.dynamic-link');
		const toogleBlocks = document.querySelectorAll('.feature');

		Array.from(toogleLinks).forEach(link => {
		    link.addEventListener('click', function(event) {
		    	Array.from(toogleBlocks).forEach(item => item.classList.add('hide'));
		        const target = this.getAttribute('href');
		        document.querySelector(target).classList.remove('hide');
		    }, false);
		});

		[...document.querySelectorAll('svg.svgtext')].forEach(el => new TextOnPath(el));

	}

	animate() {
		this.update();
		this.draw();

		this.raf = requestAnimationFrame(this.handlerAnimate);
	}

	// ---------------------------------------------------------------------------------------------
	// PUBLIC
	// ---------------------------------------------------------------------------------------------

	update() {
		if (this.gui.stats) this.gui.stats.begin();
		if (this.webgl) this.webgl.update();
		if (this.gui) this.gui.update();
	}

	draw() {
		if (this.webgl) this.webgl.draw();
		if (this.gui.stats) this.gui.stats.end();
	}

	// ---------------------------------------------------------------------------------------------
	// EVENT HANDLERS
	// ---------------------------------------------------------------------------------------------

	resize() {
		if (this.webgl) this.webgl.resize();
	}

	keyup(e) {
		// g
		if (e.keyCode == 71) { if (this.gui) this.gui.toggle(); }
	}

	click(e) {
		this.webgl.next();
	}
}
