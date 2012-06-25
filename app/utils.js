App.Utils = (function(lng, undefined) {

	//Non-LungoJS module for JS utilities
	
	//===== VIEW UTILITIES =====//

	var TimeAgo = function(timestamp) {
		var time_ago = (timestamp) ? moment(timestamp, 'YYYY-MM-DD HH:mm:ssZZ').fromNow() : '';
		return time_ago;
	};

	var FormatDate = function(timestamp) {
		var date = moment(timestamp, 'YYYY-MM-DD HH:mm:ssZZ').format('DD MMM YYYY, HH:mm:ss');
		return date;
	};

	var FileSize = function(size) {
		var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		for(var i = 0; size >= 1024; i++) {
			size /= 1024;
		}
		return size.toFixed(1) + ' ' + units[i];
	};

	var GetIcon = function(keyword) {
		switch (keyword) {
			case 'added': return 'add';
			case 'commit': return 'check';
			case 'create': return 'add mini';
			case 'cset_comment_created': return 'message mini';
			case 'cset_comment_deleted': return 'trash mini';
			case 'duplicate': return 'files';
			case 'invalid': return 'close';
			case 'issue_comment': return 'message mini';
			case 'issue_update': return 'refresh mini';
			case 'modified': return 'edit';
			case 'new': return 'add';
			case 'on hold': return 'clock';
			case 'open': return 'warning';
			case 'removed': return 'remove';
			case 'resolved': return 'check';
			case 'report_issue': return 'warning mini';
			case 'start_follow_issue': return 'search mini';
			case 'stop_follow_issue': return 'close mini';
			case 'start_follow_repo': return 'search mini';
			case 'stop_follow_repo': return 'close mini';
			case 'wontfix': return 'close';
		}
	};

	var Capitalize = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	var Serialize = function(string) {
		return $$.serializeParameters(string).slice(1);
	};

	// TODO: Find a working encoder (this one cuts the 1st letter)
	var ToHTML = function(str) {
		/*var aStr = str.split(''), i = aStr.length, aRet = [];
		while (--i) {
			var iC = aStr[i].charCodeAt();
			if (iC < 65 || iC > 127 || (iC>90 && iC<97)) {
				aRet.push('&#'+iC+';');
			} else {
				aRet.push(aStr[i]);
			}
		}
		return aRet.reverse().join('');*/
		return str;
	};

	/*	Autogrow
		http://googlecode.blogspot.com/2009/07/gmail-for-mobile-html5-series.html */

	var AutoGrow = function (element, lh) {
		function handler(e) {
			var newHeight = this.scrollHeight, currentHeight = this.clientHeight;
			if (newHeight > currentHeight) {
				this.style.height = newHeight + 3 * textLineHeight + "px";
				// Added: LungoJS needs the parent iScroll to be refreshed
				var iScroll = lng.dom(this).closest('article').attr('id');
				lng.View.Scroll.refresh(iScroll);
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
		TimeAgo: TimeAgo,
		FormatDate: FormatDate,
		FileSize: FileSize,
		GetIcon: GetIcon,
		Capitalize: Capitalize,
		Serialize: Serialize,
		ToHTML: ToHTML,
		AutoGrow: AutoGrow
	};

})(LUNGO);