App.View = (function(lng, app, undefined) {
		
	//===== TEMPLATES =====//

	lng.View.Template.create('repolist-tmpl',
		'<a href="#" data-target="article" data-icon="folder" data-label="{{name}}" data-repo="{{owner}}/{{slug}}"></a>'
	);

	lng.View.Template.create('recent-tmpl',
		'<li>\
			<div class="onright">{{utc_created_on}}</div>\
			<a href="#"><span class="icon check mini"></span>{{event}}: {{description}}</a>\
		</li>'
	);

	lng.View.Template.create('commits-tmpl',
		'<li id="{{node}}">\
			<div class="onright">{{utctimestamp}}</div>\
			<span class="check"></span><a href="#">{{branch}}/{{node}}</a>\
			<small>{{message}}</small>\
		</li>'
	);

	//===== VIEW UTILITIES =====//

	var UpdateTitle = function(title) {
		lng.dom('section#main header').data('title', title);
		lng.dom('section#main header span.title').html(title);
	};

	var NoElements = function(type) {
		var message = '<div style="margin-top:100px;text-align:center;">\
				<h1 class="icon" style="font-size:100pt">H</h1>\
				<p>&nbsp;</p><h2>There are no '+type+'</h2></div>';
		return message;
	};

	var TimeAgo = function(timestamp) {
		var time_ago = (timestamp) ? moment(timestamp, 'YYYY-MM-DD HH:mm:ssZZ').fromNow() : '';
		return time_ago;
	};

	var FileSize = function(size) {
		var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		for(var i = 0; size >= 1024; i++) {
			size /= 1024;
		}
		return size.toFixed(1) + ' ' + units[i];
	};

	var EventIcon = function(event) {
		switch(event) {
			case 'added': return 'add';
			case 'commit': return 'check';
			case 'create': return 'add mini';
			case 'issue_comment': return 'message mini';
			case 'issue_update': return 'refresh mini';
			case 'modified': return 'edit';
			case 'removed': return 'remove';
			case 'report_issue': return 'warning mini';
			case 'stop_follow_issue': return 'close mini';
		}
	};

	var Capitalize = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};

	var EncodeHTML = function(str) {
		var aStr = str.split(''), i = aStr.length, aRet = [];
		while (--i) {
			var iC = aStr[i].charCodeAt();
			if (iC < 65 || iC > 127 || (iC>90 && iC<97)) {
				aRet.push('&#'+iC+';');
			} else {
				aRet.push(aStr[i]);
			}
		}
		return aRet.reverse().join('');
	};

	//========== USER VIEWS ==========//

	var UserInfo = function(user) {
		//console.error(user);
		lng.dom('#aside-user').data('title', user.username);
		lng.dom('#aside-user').html('<img src="'+user.avatar+'" class="icon"/>' + user.username);
	};

	var UserRecent = function(events) {
		//console.error(events);
		if (events.length > 0) {
			lng.View.Template.List.create({
				el: '#user-recent',
				template: 'recent-tmpl',
				data: events
			});
		} else {
			lng.dom('#user-recent').html(NoElements('events'));
		}
	};

	//========== REPOSITORY VIEWS ==========//

	var RepoList = function(repos) {
		lng.dom('#aside-repos').empty();
		for (var i = 0; i < repos.length; i++) {
			//console.error(repos);
			lng.dom('#aside-repos').append('<a href="#repo-recent" data-target="article" data-icon="download"\
				data-label="'+ repos[i]['name'] +'" data-title="'+ repos[i]['owner'] +'/'+ repos[i]['slug'] +'">\
				<span class="icon download"></span><abbr>'+ repos[i]['name'] +'</abbr></a>');
		}
	};
	
	var RepoRecent = function(events) {
		//console.error(events);
		lng.dom('#repo-recent').empty();
		if (events.length > 0) {
			for (var i = 0; i < events.length; i++) {
				var icon = EventIcon(events[i]['event']);
				var time_ago = TimeAgo(events[i]['utc_created_on']);
				var node = (events[i]['node']) ? events[i]['node'] : '';
				var description = (events[i]['description']) ? ': '+events[i]['description'] : '';
				lng.dom('#repo-recent').append('<li data-title="'+node+'"><a href="#">\
					<div class="onright">'+time_ago+'</div>\
					<span class="icon '+icon+'"></span>'+Capitalize(events[i]['event'])+description+'</a></li>');
			}
		} else {
			lng.dom('#repo-recent').html(NoElements('events'));
		}
	};
	
	var RepoSource = function(source) {
		//console.error(source);
		lng.dom('#repo-source').empty();
		if (source.length > 0) {
			for (var i = 0; i < source.length; i++) {
				var size = (source[i]['size']) ? FileSize(source[i]['size']) : '';
				var revision = (source[i]['revision']) ? source[i]['revision'] : '';
				lng.dom('#repo-source').append('<li data-title="'+source[i]['path']+'" data-type="'+source[i]['type']+'">\
					<a href="#"><div class="onright">'+size+'</div>\
					<span class="icon '+source[i]['icon']+'"></span>'+source[i]['path']+'\
					<small>'+revision+'</small></a></li>');
			}
		} else {
			lng.dom('#repo-source').html(NoElements('files'));
		}
	};

	var RepoCommits = function(commits) {
		//console.error(commits);
		lng.dom('#repo-commits').empty();
		if (commits.length > 0) {
			for (var i = commits.length-1; i >= 0; i--) {
				var branch = (commits[i]['branch']) ? ' ('+commits[i]['branch']+')' : '';
				var time_ago = moment(commits[i]['utctimestamp'], 'YYYY-MM-DD HH:mm:ssZZ').fromNow();
				lng.dom('#repo-commits').append('<li data-title="'+commits[i]['node']+'">\
					<a href="#" data-target="section"><div class="onright">'+time_ago+'</div>\
					<span class="icon check"></span>'+commits[i]['node']+branch+'\
					<small>'+commits[i]['message']+'</small></a></li>');
			}
		} else {
			lng.dom('#repo-commits').html(NoElements('events'));
		}
	};

	//========== DETAIL VIEWS ==========//

	var CommitDetail = function(detail) {
		
		lng.dom('section#commit-detail header').data('title', detail.node);
		lng.dom('section#commit-detail header span.title').html(detail.node);

		var time_ago = moment(detail.utctimestamp, 'YYYY-MM-DD HH:mm:ssZZ').format('DD/MMM/YYYY, HH:mm:ss');
		lng.dom('#commit-detail-node').html(detail.node);
		lng.dom('#commit-detail-branch').html(detail.branch);
		lng.dom('#commit-detail-author').html(detail.author);
		lng.dom('#commit-detail-date').html(time_ago);
		lng.dom('#commit-detail-msg').html(detail.message);

		lng.dom('#commit-detail-files').empty();
		if (detail.files.length > 0) {
			for (var i = 0; i < detail.files.length; i++) {
				var icon = EventIcon(detail.files[i]['type']);
				lng.dom('#commit-detail-files').append('<li>\
					<span class="icon '+icon+'"></span>'+detail.files[i]['file']+'\
					<small>'+Capitalize(detail.files[i]['type'])+'</small></a></li>');
			}
		} else {
			lng.dom('#commit-detail-files').html(NoElements('files'));
		}
	};

	return {
		UserInfo: UserInfo,
		UserRecent: UserRecent,
		UpdateTitle: UpdateTitle,
		RepoList: RepoList,
		RepoSource: RepoSource,
		RepoRecent: RepoRecent,
		RepoCommits: RepoCommits,
		CommitDetail: CommitDetail
	};

})(LUNGO, App);