require("./index.scss");
require("../common/common.js");
import $ from 'jquery';
import 'jquery-scrollify';

$(function () {
	$.scrollify({
		section: ".scrolls",
		sectionName : "section-name",
		scrollSpeed: 800,
		scrollbars: true,
		before: function () {
			$('.scrolls').removeClass('active')
			var current = $.scrollify.current();
			current.addClass('active')
		}


	});

})

$(".menu__item-link").click(function(e) {
	e.preventDefault();
	console.log($(this).attr("href"))
	$.scrollify.move($(this).attr("href"));
});