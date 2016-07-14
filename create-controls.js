(function(root, factory) {
	if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.CreateControls = factory();
	}
})(this, function() {

	'use strict';

	var CreateControls = {};

	var _cssClasses = {
		CONTROLS: 'm-p-g__controls',
		CONTROLS_CLOSE: 'm-p-g__controls-close',
		CONTROLS_ARROW: 'm-p-g__controls-arrow',
		CONTROLS_NEXT: 'm-p-g__controls-arrow--next',
		CONTROLS_PREV: 'm-p-g__controls-arrow--prev',
		CONTROLS_BTN: 'm-p-g__btn'
	};

	var controlsCloseSvg = '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';

	var controlsPrevSvg = '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>';

	var controlsNextSvg = '<svg fill="#FFFFFF" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>';

	function _createEl(el, className, attr) {
		var element = document.createElement(el);
		if (className && typeof className === 'object') {
			className.forEach(function(c) {
				element.classList.add(c);
			});
		} else {
			element.classList.add(className);
		}
		return element;
	}

	function init() {
		var controls = _createEl('div', _cssClasses.CONTROLS);
		var close = _createEl('button', _cssClasses.CONTROLS_CLOSE);
		var next = _createEl('button', [_cssClasses.CONTROLS_ARROW, _cssClasses.CONTROLS_NEXT]);
		var prev = _createEl('button', [_cssClasses.CONTROLS_ARROW, _cssClasses.CONTROLS_PREV]);

		var childrenControls = [close, next, prev];

		for (var i = 0; i < childrenControls.length; i++) {
			controls.appendChild(childrenControls[i]);
		}

		var closeBtn = _createEl('span', _cssClasses.CONTROLS_BTN);
		var nextBtn = _createEl('span', _cssClasses.CONTROLS_BTN);
		var prevBtn = _createEl('span', _cssClasses.CONTROLS_BTN);

		closeBtn.innerHTML = controlsCloseSvg;
		nextBtn.innerHTML = controlsNextSvg;
		prevBtn.innerHTML = controlsPrevSvg;

		close.appendChild(closeBtn);
		next.appendChild(nextBtn);
		prev.appendChild(prevBtn);

		return controls;
	}

	CreateControls.init = init;

	return CreateControls;

});