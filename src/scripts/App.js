import WebGLView from './webgl/WebGLView';
import GUIView from './gui/GUIView';
import barba from '@barba/core';
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
		const transition = document.querySelectorAll('.cta');

		var tl = new TimelineMax({
			paused: true
		});

		tl.to('.transitionLayer1', 2, {height: '100vh', ease: Expo.easeOut}, 0)
		.to('.transitionLayer1', 1, {height: '0vh', ease: Expo.easeOut}, 2);

		tl.to('.transitionLayer2', 2, {height: '100vh', ease: Expo.easeOut}, 0)
		.to('.transitionLayer2', 4, {height: '40vh', ease: Expo.easeOut}, 2);

		Array.from(toogleLinks).forEach(link => {
			link.addEventListener('click', function(event) {
				tl.restart();
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
