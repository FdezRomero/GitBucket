App.Events = (function(lng, app, undefined) {

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
			}
		} else {
			lng.Router.section('login');
		}
	});

	lng.dom('#login-btn').tap(function() {
		var username = lng.dom('#login-username').val();
		var password = lng.dom('#login-password').val();

		if (username.length > 0 && password.length > 0) {
			lng.Data.Storage.persistent('username', username);
			lng.Data.Storage.persistent('token', Base64.encode(username+':'+password));
			
			App.Services.SetBasicAuth();
			var login_confirm = App.Services.CheckLogin();
			//console.error(login_confirm);

			if (login_confirm.toLowerCase() == username.toLowerCase()) {
				lng.dom('body').trigger('login');
				lng.Router.back();
			} else {
				alert('The username/password combination is not valid.');
			}

		} else {
			alert("The username and password cannot be blank.");
		}
	});

	lng.dom('body').on('login', function() {

		var username = lng.Data.Storage.persistent('username');

		HideFooter();
		lng.Data.Storage.session('current_title', username);
		App.View.UpdateTitle(username);

		App.Services.UserInfo();
		App.Services.UserRecent();
		App.Services.RepoList();
	});

	lng.dom('aside#aside-menu a').tap(function() {
		
		var title = lng.dom(this).data('title');

		lng.Data.Storage.session('current_title', title);
		App.View.UpdateTitle(title);

		if (lng.dom(this).parent().attr('id') == 'aside-repos') {
			UpdateRepo(title, 'cache');
			ShowFooter();
		} else {
			HideFooter();
		}
	});

	lng.dom('section#main a#refresh').tap(function() {
	
	/*lng.Data.Sql.select('pictures', null, function(result) {
		console.error(result);
		if (result.length > 0) { //Tenemos datos en la DB
			App.View.pictures(result);
		} else {
			App.Services.panoramioPictures();
		}
	});*/
	
		App.Services.RepoList();

		var user_repo = lng.Data.Storage.session('current_title');
		UpdateRepo(user_repo, 'refresh');
	});

	// TODO: Something throws SYNTAX_ERR: DOM Exception 12
	lng.dom('#repo-commits li, #repo-recent li').tap(function() {
		if (lng.dom(this).data('title')) {
			var user_repo = lng.Data.Storage.session('current_title');
			var commit = lng.dom(this).data('title');
			App.Services.CommitDetail(user_repo, commit);
			App.Services.CommitComments(user_repo, commit);
			lng.Router.section('commit-detail');
		}
	});

	lng.dom('#repo-source li').tap(function() {

		var user_repo = lng.Data.Storage.session('current_title');

		if (lng.dom(this).data('title') && lng.dom(this).data('type') == 'dir') {
			var dir = lng.dom(this).data('title');
			var path_url = App.Data.StorePath(dir); // Advance one history level
			//var path_url = lng.Data.Storage.session('path_history').join('/'); // Create the URL
			App.Services.RepoSource(user_repo, path_url);
		} else if (lng.dom(this).data('title') && lng.dom(this).data('type') == 'file') {
			console.error('Show highlighted source code');
		} else if (lng.dom(this).data('type') == 'back') {
			var path_url = App.Data.PathBack(); // Go back one history level
			App.Services.RepoSource(user_repo, path_url);
		}
	});

	/*lng.dom('article#repo-commits li').tap(function() {
		var user_repo = lng.Data.Storage.session('current_title');
		var commit = lng.dom(this).attr('id');
		App.Services.CommitDetail(user_repo, commit);
	});*/

	//========== UTILITIES ==========//

	var UpdateRepo = function(user_repo, method) {
		App.Services.RepoRecent(user_repo, method);
		App.Services.RepoSource(user_repo, null, method);
		App.Services.RepoCommits(user_repo, method);
	};

	var ShowFooter = function() {
		lng.dom('#main footer').show();
	};

	var HideFooter = function() {
		lng.dom('#main footer').hide();
	};
	
	return {

	};

})(LUNGO, App);