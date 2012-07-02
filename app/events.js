App.Events = (function(lng, app, undefined) {

	//========== DEVICE READY ==========//

	lng.dom('body').ready(function() {

		App.Data.ClearSessionStorage();
		var username = lng.Data.Storage.persistent('username');
		var token = lng.Data.Storage.persistent('token');

		if (username && token) {
			App.Services.SetBasicAuth();
			var login_confirm = App.Services.CheckLogin();

			if (login_confirm.toLowerCase() == username.toLowerCase()) {
				lng.dom('body').trigger('login');
			} else {
				lng.Router.section('login');
				alert('The username/password combination is not valid.');
			}
		} else {
			lng.Router.section('login');
		}
	});

	//========== LOGIN EVENTS ==========//

	lng.dom('#login-btn').tap(function() {
		
		App.View.GrowlShow();
		var username = lng.dom('#login-username').val();
		var password = lng.dom('#login-password').val();

		if (username.length > 0 && password.length > 0) {
			lng.Data.Storage.persistent('username', username);
			lng.Data.Storage.persistent('token', App.Utils.Base64(username+':'+password));
			
			App.Services.SetBasicAuth();
			var login_confirm = App.Services.CheckLogin();
			//console.error(login_confirm);
			
			if (login_confirm) {
				if (login_confirm.toLowerCase() == username.toLowerCase()) {
					lng.dom('body').trigger('login');
					lng.Router.back();
				} else {
					alert('The username/password combination is not valid.');
				}
			} else {
				alert('The username/password combination is not valid.');
			}
		} else {
			alert("The username and password cannot be blank.");
		}
	});

	lng.dom('body').on('login', function() {

		App.View.GrowlShow();
		var username = lng.Data.Storage.persistent('username');

		HideFooter();
		lng.Data.Storage.session('current_title', username);
		App.View.UpdateTitle(username);
		App.View.CreatePullables();

		App.Services.UserInfo();
		//App.Services.UserRecent();
		App.Services.RepoList();
		App.Services.UserDashboard();
	});

	//========== ASIDE EVENTS ==========//

	lng.dom('aside#aside-menu a').tap(function() {
		
		App.Data.ClearSessionStorage();
		var user_repo = lng.dom(this).data('title');
		App.Data.CurrentRepo(user_repo);
		var type = lng.dom(this).data('scm');
		App.Data.CurrentRepoType(type);

		lng.Data.Storage.session('current_title', user_repo);
		App.View.UpdateTitle(user_repo);

		if (lng.dom(this).parent().attr('id') == 'aside-repos') {
			UpdateRepo(user_repo);
			ShowFooter();
		} else {
			HideFooter();
		}
	});

	// Swipe right to open the aside
	lng.dom('#main').swipeRight(function() {
		lng.View.Aside.show('#main', '#aside-menu');
	});

	// Swipe left to close the aside
	lng.dom('#main').swipeLeft(function() {
		lng.View.Aside.hide('#main', '#aside-menu');
	});

	//========== REPOSITORY EVENTS ==========//

	/*lng.dom('#main-refresh').tap(function() {
		App.Services.RepoList();
		var user_repo = App.Data.CurrentRepo();
		UpdateRepo(user_repo, 'refresh');
	});*/

	lng.dom('#user-refresh').tap(function() {
		App.View.GrowlShow();
		App.Services.RepoList();
		App.Services.UserDashboard();
	});

	lng.dom('#repo-commits li').tap(function() {
		if (lng.dom(this).data('title')) {
			App.View.GrowlShow();
			var user_repo = App.Data.CurrentRepo();
			var commit = lng.dom(this).data('title');
			App.Data.CurrentCommit(commit);
			App.Services.CommitDetail(user_repo, commit);
			App.Services.CommitComments(user_repo, commit);
			lng.Router.section('commit-detail');
		}
	});

	lng.dom('#repo-source li').tap(function() {

		App.View.GrowlShow();
		var user_repo = App.Data.CurrentRepo();

		if (lng.dom(this).data('title') && lng.dom(this).data('type') == 'dir') {
			var dir = lng.dom(this).data('title');
			var path_url = App.Data.StorePath(dir); // Advance one history level
			App.Services.RepoSource(user_repo, path_url);
		} else if (lng.dom(this).data('title') && lng.dom(this).data('type') == 'file') {
			console.error('Show highlighted source code');
		} else if (lng.dom(this).data('type') == 'back') {
			var path_url = App.Data.PathBack(); // Go back one history level
			App.Services.RepoSource(user_repo, path_url);
		}
	});

	lng.dom('#repo-issues li').tap(function() {
		if (lng.dom(this).data('title')) {
			App.View.GrowlShow();
			var user_repo = App.Data.CurrentRepo();
			var issue = lng.dom(this).data('title');
			App.Data.CurrentIssue(issue);
			App.Services.IssueDetail(user_repo, issue);
			App.Services.IssueComments(user_repo, issue);
			lng.Router.section('issue-detail');
		}
	});

	lng.dom('#repo-issues-search-btn').tap(function() {
		App.View.GrowlShow();
		var user_repo = App.Data.CurrentRepo();
		App.Services.SearchIssue(user_repo);
	});

	//========== DETAIL EVENTS ==========//

	lng.dom('#commit-detail-left').tap(function() {
		lng.dom('#commit-detail-info li span').empty();
		lng.dom('#commit-detail-comments').empty();
	});

	lng.dom('#commit-detail-refresh').tap(function() {
		App.View.GrowlShow();
		var user_repo = App.Data.CurrentRepo();
		var commit = App.Data.CurrentCommit();
		App.Services.CommitDetail(user_repo, commit);
		App.Services.CommitComments(user_repo, commit);
	});

	lng.dom('#issue-detail-left').tap(function() {
		lng.dom('#issue-detail-info').empty();
		lng.dom('#issue-detail-comments').empty();
	});

	lng.dom('#issue-detail-refresh').tap(function() {
		App.View.GrowlShow();
		var user_repo = App.Data.CurrentRepo();
		var issue = App.Data.CurrentIssue();
		App.Services.IssueDetail(user_repo, issue);
		App.Services.IssueComments(user_repo, issue);
	});

	//========== COMPOSE EVENTS ==========//

	lng.dom('#compose-issue-btn').tap(function() {
		App.View.RefreshIssueSelects();
		App.View.NewIssue();
		new App.Utils.AutoGrow(document.getElementById('compose-issue-msg'), 3); // 3 -- line height
		lng.Router.section('compose-issue');
	});

	lng.dom('#update-issue-btn').tap(function() {
		App.View.GrowlShow();
		var user_repo = App.Data.CurrentRepo();
		var issue = App.Data.CurrentIssue();
		App.View.RefreshIssueSelects();
		App.Services.LoadIssue(user_repo, issue);
		new App.Utils.AutoGrow(document.getElementById('compose-issue-msg'), 3); // 3 -- line height
		lng.Router.section('compose-issue');
	});

	lng.dom('#compose-issue-send').tap(function() {
		App.View.GrowlShow();
		var user_repo = App.Data.CurrentRepo();
		var issue = App.Data.CurrentIssue();
		var action = lng.dom(this).data('action');
		if (action == 'new') {
			App.Services.PostIssue(user_repo);
		} else if (action == 'update') {
			App.Services.UpdateIssue(user_repo, issue);
		}
	});

	lng.dom('#commit-comment-btn').tap(function() {
		App.View.NewComment('commit');
		lng.Router.section('compose-comment');
	});

	lng.dom('#issue-comment-btn').tap(function() {
		App.View.NewComment('issue');
		lng.Router.section('compose-comment');
	});

	lng.dom('#compose-comment-send').tap(function() {
		App.View.GrowlShow();
		var user_repo = App.Data.CurrentRepo();
		var commit = App.Data.CurrentCommit();
		var issue = App.Data.CurrentIssue();
		var type = lng.dom(this).data('type');
		if (type == 'commit') {
			App.Services.PostCommitComment(user_repo, commit);
		} else if (type == 'issue') {
			App.Services.PostIssueComment(user_repo, issue);
		}
	});

	lng.dom('#issue-reset-btn').tap(function() {
		App.View.ResetForm('#compose-issue-form');
	});

	//========== PULL-TO-REFRESH ==========//

	var PullDownAction = function(article, scroll) {
		
		var user_repo = App.Data.CurrentRepo();
		var path_history = lng.Data.Storage.session('path_history');
		var path = (path_history) ? path_history.join('/') : null;
		
		switch(article) {
			case 'repo-commits':
				App.Services.RepoCommits(user_repo, true);
				break;
			case 'repo-source':
				App.Services.RepoSource(user_repo, path, true);
				break;
			case 'repo-issues':
				App.Services.RepoIssues(user_repo, true);
				break;
		}
	};

	var PullUpAction = function(article, scroll) {
		
		var user_repo = App.Data.CurrentRepo();
		var path_history = lng.Data.Storage.session('path_history');
		var path = (path_history) ? path_history.join('/') : null;
		
		switch(article) {
			case 'repo-commits':
				//App.Services.RepoCommits(user_repo);
				setTimeout(function(){App.View.StopPullable('repo-commits');}, 1000);
				break;
			case 'repo-source':
				//App.Services.RepoSource(user_repo, path);
				setTimeout(function(){App.View.StopPullable('repo-source');}, 1000);
				break;
			case 'repo-issues':
				//App.Services.RepoIssues(user_repo);
				setTimeout(function(){App.View.StopPullable('repo-issues');}, 1000);
				break;
		}
	};

	//========== EVENT UTILITIES ==========//

	var UpdateRepo = function(user_repo) {
		App.View.GrowlShow();
		//App.Services.RepoRecent(user_repo);
		App.Services.RepoDashboard(user_repo);
		App.Services.RepoCommits(user_repo);
		App.Services.RepoSource(user_repo, null);
		App.Services.RepoIssues(user_repo);
	};

	var ShowFooter = function() {
		lng.dom('#main footer').show();
	};

	var HideFooter = function() {
		lng.dom('#main footer').hide();
	};

	/*lng.Data.Sql.select('pictures', null, function(result) {
		console.error(result);
		if (result.length > 0) { //Tenemos datos en la DB
			App.View.pictures(result);
		} else {
			App.Services.panoramioPictures();
		}
	});*/
	
	return {
		UpdateRepo: UpdateRepo,
		ShowFooter: ShowFooter,
		HideFooter: HideFooter,
		PullDownAction: PullDownAction,
		PullUpAction: PullUpAction
	};

})(LUNGO, App);