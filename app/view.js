App.View = (function(lng, app, undefined) {
		
	//===== TEMPLATES =====//

	lng.View.Template.create('recent-tmpl',
		'<li>\
			<div class="onright">{{utc_created_on}}</div>\
			<a href="#"><span class="icon check mini"></span>{{event}}: {{description}}</a>\
		</li>'
	);

	//========== USER VIEWS ==========//

	var UserInfo = function(user) {
		//console.error(user);
		lng.dom('#aside-user').data('title', user.username);
		lng.dom('#aside-user').html('<img src="'+user.avatar+'" class="icon"/> ' + user.username);

		lng.dom('#user-dashboard-avatar').html('<img src="'+user.avatar+'" class="icon" style="float:none"/> '+user['first_name']+' '+user['last_name']);
	};

	var UserRecent = function(events) {
		//console.error(events);
		if (events.length > 0) {
			lng.View.Template.List.create({
				el: '#user-recent ul',
				template: 'recent-tmpl',
				data: events
			});
		} else {
			lng.dom('#user-recent ul').html(NoElements('events'));
		}
	};

	//========== REPOSITORY VIEWS ==========//

	var RepoList = function(repos) {
		//console.error(repos);
		lng.dom('#aside-repos').empty();
		for (var i = 0; i < repos.length; i++) {
			//console.error(repos);
			lng.dom('#aside-repos').append('<a href="#repo-dashboard" data-target="article" data-icon="download" data-label="'+repos[i]['name']+'" \
				data-title="'+repos[i]['owner']+'/'+repos[i]['slug']+'" data-scm="'+repos[i]['scm']+'">\
				<span class="icon download"></span><abbr>'+App.Utils.Capitalize(repos[i]['owner'])+'/'+repos[i]['name']+'</abbr></a>');
		}
		RefreshScroll('aside-menu');
	};
	
	var RepoRecent = function(events) {
		//console.error(events);
		lng.dom('#repo-recent ul').empty();
		if (events.length > 0) {
			for (var i = 0; i < events.length; i++) {
				var icon = App.Utils.GetIcon(events[i]['event']);
				var time_ago = App.Utils.TimeAgo(events[i]['utc_created_on']);
				var node = (events[i]['node']) ? events[i]['node'] : '';
				var description = (events[i]['description']) ? ': '+events[i]['description'] : '';
				lng.dom('#repo-recent ul').append('<li data-title="'+node+'"><a href="#">\
					<div class="onright">'+time_ago+'</div><span class="icon '+icon+'"></span>\
					'+App.Utils.Capitalize(events[i]['event'])+description+'</a></li>');
			}
		} else {
			lng.dom('#repo-recent ul').append(NoElements('events'));
		}
		RefreshScroll('repo-recent');
	};

	var RepoDashboard = function(info) {
		//console.error(info);

		var website = (info['website']) ? info['website'] : 'N/A';
		var followers = info['followers_count'].toString();
		var forks = info['forks_count'].toString();
		var scm = (info['scm'] == 'hg') ? 'Mercurial' : 'Git';
		var access = (info['is_private']) ? 'Private' : 'Public';

		// Build our object with all the properties and innerHTMLs
		var obj = {'desc':App.Utils.ToHTML(info['description']), 'web':website, 'followers':followers, 'forks':forks,
			'scm':scm, 'access':access, 'lang':App.Utils.Capitalize(info['language']),
			'created':App.Utils.FormatDate(info['utc_created_on']), 'updated':App.Utils.FormatDate(info['utc_last_updated'])};

		for (var x in obj) {
			if (obj[x]) {
				lng.dom('#repo-dashboard-'+x).html(obj[x]);
			}
		}
		RefreshScroll('repo-dashboard');
	};

	var RepoCommits = function(response, refresh) {
		//console.error(response);
		var commits = response.changesets;
		EmptyPullable('repo-commits');
		
		if (commits.length > 0) {
			for (var i = commits.length-1; i >= 0; i--) {
				var branch = (commits[i]['branch']) ? ' ('+commits[i]['branch']+')' : '';
				var time_ago = App.Utils.TimeAgo(commits[i]['utctimestamp']);
				lng.dom('#repo-commits ul').append('<li data-title="'+commits[i]['node']+'">\
					<a href="#"><div class="onright">'+time_ago+'</div>\
					<span class="icon check"></span>'+commits[i]['node']+branch+'\
					<small>'+commits[i]['message']+'</small></a></li>');
			}
			if (response.count > commits.length) {
				lng.dom('#repo-commits ul').append('<li class="load-more" data-start="x" data-limit="x">\
					<a id="load-more-btn" href="#">Load more...</a></li>');
			}
		} else {
			lng.dom('#repo-commits ul').append(NoElements('events'));
		}
		if (refresh) { StopPullable('repo-commits'); } else { RefreshPullable('repo-commits'); }
	};

	var RepoSource = function(source, refresh) {
		//console.error(source);
		EmptyPullable('repo-source');

		if (source.length > 0) {
			for (var i = 0; i < source.length; i++) {
				var size = (source[i]['size']) ? App.Utils.FileSize(source[i]['size']) : '';
				var revision = (source[i]['revision']) ? source[i]['revision'] : '';
				lng.dom('#repo-source ul').append('<li data-title="'+source[i]['path']+'" data-type="'+source[i]['type']+'">\
					<a href="#"><div class="onright">'+size+'</div>\
					<span class="icon '+source[i]['icon']+'"></span>'+source[i]['path']+'\
					<small>'+revision+'</small></a></li>');
			}
		} else {
			lng.dom('#repo-source ul').append(NoElements('files'));
		}
		if (refresh) { StopPullable('repo-source'); } else { RefreshPullable('repo-source'); }
		GrowlHide();
	};

	var RepoIssues = function(issues, refresh) {
		//console.error(issues);
		EmptyPullable('repo-issues');

		var query = App.Data.CurrentIssueQuery();
		query = (query) ? query : ''; // null -> empty string
		
		lng.dom('#repo-issues ul').append('<li style="background:#EDEDED">\
			<input type="search" id="repo-issues-search" placeholder="Search issues..." value="'+query+'">\
            <a id="repo-issues-search-btn" href="#" class="button"><span class="icon search"></span></a></li>');

		if (issues.length > 0) {
			for (var i = 0; i < issues.length; i++) {
				var time_ago = App.Utils.TimeAgo(issues[i]['utc_last_updated']);
				var icon = App.Utils.GetIcon(issues[i]['status']);
				lng.dom('#repo-issues ul').append('<li data-title="'+issues[i]['local_id']+'">\
					<a href="#"><div class="onright">'+time_ago+'</div>\
					<span class="icon '+icon+'"></span>#'+issues[i]['local_id']+': '+issues[i]['title']+'\
					<small>Status: '+issues[i]['status']+'</small></a></li>');
			}
		} else {
			lng.dom('#repo-issues ul').append(NoElements('issues'));
		}
		if (refresh) { StopPullable('repo-issues'); } else { RefreshPullable('repo-issues'); }
	};

	var IssuesBadge = function(count) {
		if (count > 0) {
			lng.dom('#footer-issues').html('<span class="icon warning"></span><abbr>Issues</abbr>\
				<span class="bubble count">'+count+'</span>');
		} else {
			lng.dom('#footer-issues').html('<span class="icon warning"></span><abbr>Issues</abbr>');
		}
		GrowlHide();
	};

	//========== DETAIL VIEWS ==========//

	var CommitDetail = function(detail) {
		//console.error(detail);

		lng.dom('#commit-detail header').data('title', detail.node);
		lng.dom('#commit-detail header span.title').html(detail.node);

		App.Data.CurrentCommitDesc(detail.message);

		// Info tab
		var formatted_date = App.Utils.FormatDate(detail.utctimestamp);
		var branch = (detail.branch) ? detail.branch : '(none)';
		lng.dom('#commit-detail-node').html(detail.node);
		lng.dom('#commit-detail-branch').html(branch);
		lng.dom('#commit-detail-author').html(detail.author);
		lng.dom('#commit-detail-date').html(formatted_date);
		lng.dom('#commit-detail-msg').html(App.Utils.ToHTML(detail.message));

		// Files tab
		lng.dom('#commit-detail-files ul').empty();
		if (detail.files.length > 0) {
			for (var i = 0; i < detail.files.length; i++) {
				var icon = App.Utils.GetIcon(detail.files[i]['type']);
				lng.dom('#commit-detail-files ul').append('<li><span class="icon '+icon+'"></span>\
					'+detail.files[i]['file']+'<small>'+App.Utils.Capitalize(detail.files[i]['type'])+'\
					</small></a></li>');
			}
		} else {
			lng.dom('#commit-detail-files ul').html(NoElements('files'));
		}
		RefreshScroll('commit-detail-info');
		RefreshScroll('commit-detail-files');
	};

	var CommitComments = function(comments) {
		//console.error(comments);
		lng.dom('#commit-detail-comments ul').empty();
		var num_comments = 0;
		
		//Comments tab
		if (comments.length > 0) {
			for (var i = 0; i < comments.length; i++) {
				if (comments[i]['content']) { // Don't display comment if no content
					var time_ago = App.Utils.TimeAgo(comments[i]['utc_created_on']);
					lng.dom('#commit-detail-comments ul').append('<li><div class="onright">'+time_ago+'</div>\
						<img src="'+comments[i]['user_avatar_url']+'" class="icon"/>\
						<label>'+comments[i]['username']+'</label><br/>'+App.Utils.ToHTML(comments[i]['content'])+'</li>');
					num_comments++;
				}
			}
		}
		if (num_comments === 0) {
			lng.dom('#commit-detail-comments ul').append(NoElements('comments'));
		}
		RefreshScroll('commit-detail-comments');
		GrowlHide();
	};

	var IssueDetail = function(detail) {
		
		lng.dom('#issue-detail header').data('title', 'Issue #'+detail.local_id);
		lng.dom('#issue-detail header span.title').html('Issue #'+detail.local_id);

		App.Data.CurrentIssueDesc(detail.content);
		
		lng.dom('#issue-detail-info ul').empty();

		// Info tab: Show only properties with a value assigned
		var reported_by = '<img src="'+detail.reported_by.avatar+'" class="icon" style="float:none"/>\
			'+detail.reported_by.username;
		var responsible = (detail.responsible) ? '<img src="'+detail.responsible.avatar+'" class="icon" style="float:none"/>\
			'+detail.responsible.username : null;
		var created_on = App.Utils.FormatDate(detail.utc_created_on);
		var last_updated = App.Utils.FormatDate(detail.utc_last_updated);
		
		// Build our object with all the properties and innerHTMLs
		var obj = {'Issue ID':'#'+detail.local_id,'Title':detail.title,'Status':App.Utils.Capitalize(detail.status),
			'Priority':App.Utils.Capitalize(detail.priority),'Reported by':reported_by,'Responsible':responsible,
			'Created on':created_on,'Last updated':last_updated,'Kind':App.Utils.Capitalize(detail.metadata.kind),
			'Component':detail.metadata.component,'Milestone':detail.metadata.milestone,
			'Version':detail.metadata.version,'Description':'<br/>'+App.Utils.ToHTML(detail.content)};

		for (var x in obj) {
			if (obj[x]) {
				lng.dom('#issue-detail-info ul').append('<li><div style="display:inline-block;width:95px">\
					<label>'+x+'</label></div>'+obj[x]+'</li>');
			}
		}
		RefreshScroll('issue-detail-info');
	};

	var IssueComments = function(comments) {
		//console.error(comments);
		lng.dom('#issue-detail-comments ul').empty();
		var num_comments = 0;

		//Comments tab
		if (comments.length > 0) {
			for (var i = 0; i < comments.length; i++) {
				if (comments[i]['content']) { // Don't display comment if no content
					var time_ago = App.Utils.TimeAgo(comments[i]['utc_updated_on']);
					lng.dom('#issue-detail-comments ul').append('<li><div class="onright">'+time_ago+'</div>\
						<img src="'+comments[i]['author_info']['avatar']+'" class="icon"/>\
						<label>'+comments[i]['author_info']['username']+'</label><br/>'+App.Utils.ToHTML(comments[i]['content'])+'</li>');
					num_comments++;
				}
			}
		}
		if (num_comments === 0) {
			lng.dom('#issue-detail-comments ul').append(NoElements('comments'));
		}
		RefreshScroll('issue-detail-comments');
		GrowlHide();
	};

	var RefreshIssueSelects = function() {
		var components = App.Data.IssueComponents();
		var milestones = App.Data.IssueMilestones();
		var versions = App.Data.IssueVersions();
		var users = App.Data.IssueUsers();

		// Add the empty options
		lng.dom('#compose-issue-component').html('<option value="" selected="selected">(None)</option>');
		lng.dom('#compose-issue-milestone').html('<option value="" selected="selected">(None)</option>');
		lng.dom('#compose-issue-version').html('<option value="" selected="selected">(None)</option>');
		lng.dom('#compose-issue-assignto').html('<option value="" selected="selected">(None)</option>');

		for (var i = 0; i < components.length; i++) {
			lng.dom('#compose-issue-component').append('<option value="'+components[i].name+'">'+components[i].name+'</option>');
		}
		for (var i = 0; i < milestones.length; i++) {
			lng.dom('#compose-issue-milestone').append('<option value="'+milestones[i].name+'">'+milestones[i].name+'</option>');
		}
		for (var i = 0; i < versions.length; i++) {
			lng.dom('#compose-issue-version').append('<option value="'+versions[i].name+'">'+versions[i].name+'</option>');
		}
		for (var i = 0; i < users.length; i++) {
			lng.dom('#compose-issue-assignto').append('<option value="'+users[i]+'">'+users[i]+'</option>');
		}
	};

	var NewIssue = function () {
		lng.dom('#compose-issue-form').data('title', 'New Issue');
		lng.dom('#compose-issue-form header span.title').html('New Issue');
		lng.dom('#compose-issue-send').data('action', 'new');

		RefreshScroll('compose-issue-form');
	};

	var LoadIssue = function(detail) {
		lng.dom('#compose-issue-form').data('title', 'Update #'+detail.local_id);
		lng.dom('#compose-issue-form header span.title').html('Update #'+detail.local_id);
		lng.dom('#compose-issue-send').data('action', 'update');

		lng.dom('#compose-issue-title').val(detail.title);
		lng.dom('#compose-issue-status').val(detail.status);
		lng.dom('#compose-issue-priority').val(detail.priority);
		lng.dom('#compose-issue-kind').val(detail.metadata.kind);
		lng.dom('#compose-issue-component').val(detail.metadata.component);
		lng.dom('#compose-issue-milestone').val(detail.metadata.milestone);
		lng.dom('#compose-issue-version').val(detail.metadata.version);
		lng.dom('#compose-issue-msg').val(detail.content);

		RefreshScroll('compose-issue-form');
		GrowlHide();
	};

	var ResetForm = function (id) {
		lng.dom(id+' input, '+id+' textarea').each(function() {
			lng.dom(this).val(''); // Empty the form fields
		});
		// TODO: reselect the default options
		lng.View.Scroll.first(id); // Scroll to the top
	};

	var NewComment = function (type) {
		if (type == 'commit') {
			lng.dom('#compose-comment-inreplyto').html('Commit '+App.Data.CurrentCommit());
			lng.dom('#compose-comment-desc').html(App.Data.CurrentCommitDesc());
		} else if (type == 'issue') {
			lng.dom('#compose-comment-inreplyto').html('Issue #'+App.Data.CurrentIssue());
			lng.dom('#compose-comment-desc').html(App.Data.CurrentIssueDesc());
		}
		lng.dom('#compose-comment-send').data('type', type);
		
		new App.Utils.AutoGrow(document.getElementById('compose-comment-msg'), 3);
		RefreshScroll('compose-comment-form');
	};

	//===== VIEW UTILITIES =====//

	var UpdateTitle = function(title) {
		lng.dom('#main header').data('title', title);
		lng.dom('#main header span.title').html(title);
	};

	var NoElements = function(type) {
		var message = '<div style="margin-top:100px;text-align:center;">\
				<h1 class="icon" style="font-size:100pt">H</h1>\
				<p>&nbsp;</p><h2>There are no '+type+'</h2></div>';
		return message;
	};

	var RefreshScroll = function(element) {
		lng.View.Scroll.refresh(element);
	};

	var GrowlShow = function() {
		lng.Sugar.Growl.show('Loading', '', 'refresh', false);
	};

	var GrowlHide = function() {
		lng.Sugar.Growl.hide();
	};

	//========== PULL-TO-REFRESH ==========//

	var CreatePullables = function() {
		lng.Sugar.Pullable.Create();
	};

	var EmptyPullable = function(article) {
		lng.Sugar.Pullable.Empty(article);
	};

	var StopPullable = function(article) {
		lng.Sugar.Pullable.Stop(article);
	};

	var RefreshPullable = function(article) {
		lng.Sugar.Pullable.Refresh(article);
	};

	return {
		UserInfo: UserInfo,
		UserRecent: UserRecent,
		UpdateTitle: UpdateTitle,
		RepoList: RepoList,
		RepoRecent: RepoRecent,
		RepoDashboard: RepoDashboard,
		RepoCommits: RepoCommits,
		RepoSource: RepoSource,
		RepoIssues: RepoIssues,
		IssuesBadge: IssuesBadge,
		CommitDetail: CommitDetail,
		CommitComments: CommitComments,
		IssueDetail: IssueDetail,
		IssueComments: IssueComments,
		RefreshIssueSelects: RefreshIssueSelects,
		NewIssue: NewIssue,
		LoadIssue: LoadIssue,
		ResetForm: ResetForm,
		NewComment: NewComment,
		CreatePullables: CreatePullables,
		StopPullable: StopPullable,
		RefreshScroll: RefreshScroll,
		GrowlShow: GrowlShow,
		GrowlHide: GrowlHide
	};

})(LUNGO, App);