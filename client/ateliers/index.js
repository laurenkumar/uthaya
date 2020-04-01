require("./index.scss");
require("../common/common.js");

import LocomotiveScroll from 'locomotive-scroll';

(function() {

	document.documentElement.classList.add('is-loaded');
	document.documentElement.classList.remove('is-loading');

	setTimeout(() => {
		document.documentElement.classList.add('is-ready');
	},300)

	setTimeout(() => {
		const scroll = new LocomotiveScroll({
			el: document.querySelector('#js-scroll'),
			smooth: true,
			getSpeed: true,
			getDirection: true,
			useKeyboard: true
		});

		scroll.on('scroll', (instance) => {
			const progress = 360 * instance.scroll.y / instance.limit;

			document.documentElement.setAttribute('data-direction', instance.direction)

		});
	});

})();

const can = document.querySelectorAll("img");

const randomX = random(10, 20);
const randomY = random(20, 30);
const randomDelay = random(0, 1);
const randomTime = random(3, 5);
const randomTime2 = random(5, 10);
const randomAngle = random(8, 12);

TweenLite.set(can, {
	x: randomX(-1),
	y: randomX(1),
	rotation: randomAngle(-1)
});

moveX(can, 1);
moveY(can, -1);
rotate(can, 1);

function rotate(target, direction) {

	TweenLite.to(target, randomTime2(), {
		rotation: randomAngle(direction),
    // delay: randomDelay(),
    ease: Sine.easeInOut,
    onComplete: rotate,
    onCompleteParams: [target, direction * -1]
});
}

function moveX(target, direction) {

	TweenLite.to(target, randomTime(), {
		x: randomX(direction),
		ease: Sine.easeInOut,
		onComplete: moveX,
		onCompleteParams: [target, direction * -1]
	});
}

function moveY(target, direction) {

	TweenLite.to(target, randomTime(), {
		y: randomY(direction),
		ease: Sine.easeInOut,
		onComplete: moveY,
		onCompleteParams: [target, direction * -1]
	});
}

function random(min, max) {
	const delta = max - min;
	return (direction = 1) => (min + delta * Math.random()) * direction;
}