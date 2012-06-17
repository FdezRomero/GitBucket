App.Services = (function(lng, app, undefined) {
		
	//========== USER FUNCTIONS ==========//

	var SetBasicAuth = function() {
		var token = lng.Data.Storage.persistent('token');
		$$.ajaxSettings.headers = {'Authorization': 'Basic ' + token}; // Store in persistent storage
	};
	
	var CheckLogin = function() {
		$$.ajaxSettings.async = false;
		var response = lng.Service.get('https://api.bitbucket.org/1.0/user/', null, function(){});
		$$.ajaxSettings.async = true;
		return response.user.username;
	};

	var UserInfo = function() {
		lng.Service.get('https://api.bitbucket.org/1.0/user/', null, function(response) {
			//console.error(response);
			App.View.UserInfo(response.user);
		});
	};

	var UserRecent = function() {
		var username = lng.Data.Storage.persistent('username');
		lng.Service.get('https://api.bitbucket.org/1.0/users/'+username+'/events', null, function(response) {
			//console.error(response);
			App.View.UserRecent(response.events);
		});
	};

	//========== REPOSITORY FUNCTIONS ==========//

	var RepoList = function() {
		lng.Service.get('https://api.bitbucket.org/1.0/user/repositories/', null, function(response) {
			//console.error(response);
			App.View.RepoList(response);
		});
	};

	var RepoRecent = function(user_repo, method) {
			
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/events/', null, function(response) {
			//console.error(response);
			App.View.RepoRecent(response.events);
		});
	};

	var RepoSource = function(user_repo, method) {
		
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/src/master/', null, function(response) {
			
			// Normalize directory data to file structure
			var Join = function(dirsArray, filesArray) {
				var n = dirsArray.length + filesArray.length;
				var elements = new Array(n);
				
				// Add the directories
				for (var i = 0; i < dirsArray.length; i++) {
					elements[i] = new Object({});
					elements[i].path = dirsArray[i];
					elements[i].icon = 'folder mini';
				}
				// Add the files
				for (i = dirsArray.length; i < n; i++) {
					elements[i] = new Object({});
					elements[i] = filesArray[i - dirsArray.length];
					elements[i].icon = 'file mini';
				}
				return elements;
			};
			var source = Join(response.directories, response.files);
			App.View.RepoSource(source);
		});
	};
	
	var RepoCommits = function(user_repo, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/changesets/', null, function(response) {
			//console.error(response);
			App.View.RepoCommits(response.changesets);
		});
	};

	//========== DETAIL FUNCTIONS ==========//

	var CommitDetail = function(user_repo, commit, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/changesets/'+commit, null, function(response) {
			//console.error(response);
			App.View.CommitDetail(response);
		});
	};

	return {
		SetBasicAuth: SetBasicAuth,
		CheckLogin: CheckLogin,
		UserInfo: UserInfo,
		UserRecent: UserRecent,
		RepoList: RepoList,
		RepoSource: RepoSource,
		RepoRecent: RepoRecent,
		RepoCommits: RepoCommits,
		CommitDetail: CommitDetail
	};

})(LUNGO, App);