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

	var RepoCommits = function(user_repo, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/changesets/', null, function(response) {
			//console.error(response);
			App.View.RepoCommits(response.changesets);
		});
	};

	var RepoSource = function(user_repo, dir, method) {
		var path = (dir) ? dir + '/' : '';
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/src/master/'+path, null, function(response) {
			//console.error(response);

			// Normalize directory data to file structure
			var Join = function(dirsArray, filesArray) {
				var n = dirsArray.length + filesArray.length;
				var elements = new Array();

				// Add path to go back if needed
				//console.error(path);
				if (path.length > 0) {
					var obj = new Object({'path': 'Back', 'type': 'back', 'size': null, 'revision': null, 'icon': 'left mini'});
					elements.push(obj);
				}
				// Add the directories
				for (var i = 0; i < dirsArray.length; i++) {
					var obj = new Object({'path': dirsArray[i], 'type': 'dir', 'size': null, 'revision': null, 'icon': 'folder mini'});
					elements.push(obj);
				}
				// Add the files
				for (var j = 0; j < filesArray.length; j++) {
					var obj = filesArray[j];
					obj.path = obj.path.substring(path.length);
					obj.type = 'file';
					obj.icon = 'file';
					elements.push(obj);
				}
				return elements;
			};
			var source = Join(response.directories, response.files);
			App.View.RepoSource(source);
		});
	};

	var RepoIssues = function(user_repo, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/', null, function(response) {
			//console.error(response);
			App.View.RepoIssues(response.issues);
		});
	};

	//========== DETAIL FUNCTIONS ==========//

	var CommitDetail = function(user_repo, commit, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/changesets/'+commit+'/', null, function(response) {
			//console.error(response);
			App.View.CommitDetail(response);
		});
	};

	var CommitComments = function(user_repo, commit, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/changesets/'+commit+'/comments/', null, function(response) {
			//console.error(response);
			App.View.CommitComments(response);
		});
	};

	var IssueDetail = function(user_repo, issue, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/'+issue+'/', null, function(response) {
			//console.error(response);
			App.View.IssueDetail(response);
		});
	};

	var IssueComments = function(user_repo, issue, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/'+issue+'/comments/', null, function(response) {
			//console.error(response);
			App.View.IssueComments(response);
		});
	};

	return {
		SetBasicAuth: SetBasicAuth,
		CheckLogin: CheckLogin,
		UserInfo: UserInfo,
		UserRecent: UserRecent,
		RepoList: RepoList,
		RepoRecent: RepoRecent,
		RepoCommits: RepoCommits,
		RepoIssues: RepoIssues,
		RepoSource: RepoSource,
		CommitDetail: CommitDetail,
		CommitComments: CommitComments,
		IssueDetail: IssueDetail,
		IssueComments: IssueComments
	};

})(LUNGO, App);