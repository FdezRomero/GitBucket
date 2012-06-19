App.Utils = (function(lng, undefined) {

	//Non-LungoJS module for JS utilities
	var EventIcon = function (event) {
		switch(event) {
			case 'create': return 'add';
			case 'commit': return 'check';
		}
	};

	/*	Autogrow
		http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series.html */

	var AutoGrow = function (element, lh) {
		function handler(e) {
			var newHeight = this.scrollHeight, currentHeight = this.clientHeight;
			if (newHeight > currentHeight) {
				this.style.height = newHeight + 3 * textLineHeight + "px";
			}
		}

		var setLineHeight = (lh) ? lh : 12,
		textLineHeight = element.currentStyle ? element.currentStyle.lineHeight : getComputedStyle(element, null).lineHeight;
		textLineHeight = (textLineHeight.indexOf("px") == -1) ? setLineHeight : parseInt(textLineHeight, 10);

		element.style.overflow = "hidden";
		if (element.addEventListener) {
			element.addEventListener('keyup', handler, false);
		} else {
			element.attachEvent('onkeyup', handler);
		}
	};
	
	return {
		AutoGrow: AutoGrow
	};

})(LUNGO);