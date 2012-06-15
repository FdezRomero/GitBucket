App.View = (function(lng, app, undefined) {
		
	lng.View.Template.create('repolist-tmpl',
		'<a href="#" data-target="article" data-icon="folder" data-label="{{name}}" data-repo="{{owner}}/{{slug}}"></a>'
	);

	lng.View.Template.create('recent-tmpl',
		'<li>\
			<div class="onright">{{utc_created_on}}</div>\
			<a href="#"><span class="icon check mini"></span>{{event}}: {{description}}</a>\
		</li>'
	);

	var no_events = '<div style="margin-top:100px;text-align:center;">\
				<h1 class="icon" style="font-size:100pt">H</h1>\
				<p>&nbsp;</p><h2>No events yet</h2></div>';
	
	lng.View.Template.create('source-tmpl',
		'<li id="{{path}}">\
			<span class="icon {{icon}}"></span><a href="#">{{path}}</a>\
		</li>'
	);

	lng.View.Template.create('commits-tmpl',
		'<li id="{{node}}">\
			<div class="onright">{{utctimestamp}}</div>\
			<span class="check"></span><a href="#">{{branch}}/{{node}}</a>\
			<small>{{message}}</small>\
		</li>'
	);

	var UserInfo = function(user) {
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
			lng.dom('#user-recent').html(no_events);
		}
	};

	var UpdateTitle = function(title) {
		lng.dom('section#main header').data('title', title);
		lng.dom('section#main header span.title').html(title);
	};

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
		if (events.length > 0) {
			lng.View.Template.List.create({
				el: '#repo-recent',
				template: 'recent-tmpl',
				data: events
			});
		} else {
				// Show there are no events yet
		}
	};
	
	var RepoSource = function(source) {
		lng.View.Template.List.create({
			el: '#repo-source',
			template: 'source-tmpl',
			data: source
		});
	};

	var RepoCommits = function(commits) {
		lng.View.Template.List.create({
			el: '#repo-commits',
			template: 'commits-tmpl',
			data: commits
		});
	};

    return {
		UserInfo: UserInfo,
		UserRecent: UserRecent,
		UpdateTitle: UpdateTitle,
		RepoList: RepoList,
		RepoSource: RepoSource,
		RepoRecent: RepoRecent,
		RepoCommits: RepoCommits
    };

})(LUNGO, App);