App.Services = (function(lng, app, undefined) {
		
	//========== USER FUNCTIONS ==========//

	var SetBasicAuth = function() {
		var token = lng.Data.Storage.persistent('token');
		lng.Service.Settings.headers = {'Authorization': 'Basic ' + token};
	};
	
	var CheckLogin = function() {
		lng.Service.Settings.async = false;
		var response = lng.Service.get('https://api.bitbucket.org/1.0/user/', null, function(){});
		lng.Service.Settings.async = true;
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
		var scm = (App.Data.CurrentRepoType() == 'git') ? 'master' : 'tip';
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/src/'+scm+'/'+path, null, function(response) {
			//console.error(response);

			// Normalize directory data to file structure
			var Join = function(dirsArray, filesArray) {
				var n = dirsArray.length + filesArray.length;
				var elements = new Array();

				// Add path to go back if needed
				//console.error(path);
				if (path.length > 0) {
					var obj = new Object({path: 'Back', type: 'back', size: null, revision: null, icon: 'left mini'});
					elements.push(obj);
				}
				// Add the directories
				for (var i = 0; i < dirsArray.length; i++) {
					var obj = new Object({path: dirsArray[i], type: 'dir', size: null, revision: null, icon: 'folder mini'});
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
		// Get & store for <select>'s
		IssueComponents(user_repo);
		IssueMilestones(user_repo);
		IssueVersions(user_repo);
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

	var PostCommitComments = function(user_repo, commit, method) {
		var data = new Object({
			//TODO: Get comment from UI - content: 'Testing if the comment is posted in Bitbucket'
		});
		
		var serial_data = App.Utils.Serialize(data);
		
		if(data.content){
			lng.Service.post('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/changesets/'+commit+'/comments/', serial_data, function(response) {
				alert('Your comment have been posted successfully.');
				//Reload Comments
				CommitComments(user_repo,commit,method);
			});
		}else{
			alert('You have to type a comment.');
		}
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

	var IssueComponents = function(user_repo, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/components/', null, function(response) {
			//console.error(response);
			App.Data.IssueComponents(response);
		});
	};

	var IssueMilestones = function(user_repo, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/milestones/', null, function(response) {
			//console.error(response);
			App.Data.IssueMilestones(response);
		});
	};

	var IssueVersions = function(user_repo, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/versions/', null, function(response) {
			//console.error(response);
			App.Data.IssueVersions(response);
		});
	};

	var PostIssue = function(user_repo, method) {
		
		var data = new Object({
			title: lng.dom('#compose-issue-title').val(),
			content: lng.dom('#compose-issue-msg').val(),
			component: lng.dom('#compose-issue-component').val(),
			milestone: lng.dom('#compose-issue-milestone').val(),
			version: lng.dom('#compose-issue-version').val(),
			//'responsible: null, // TODO: get a list of repo users
			priority: lng.dom('#compose-issue-priority').val(),
			status: lng.dom('#compose-issue-status').val(),
			kind: lng.dom('#compose-issue-kind').val()
		});
		//console.error(data);

		var serial_data = App.Utils.Serialize(data);
		if (data.title && data.content) {
			lng.Service.post('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/', serial_data, function(response) {
				console.error(response);
				RepoIssues(user_repo, method);
				alert('Issue #'+response.local_id+' was created');
				lng.Router.back();
			});
		} else {
			alert('The issue must have a title and a description.');
		}
	};

	// Populates the issue composer with previous data
	var LoadIssue = function(user_repo, issue, method) {
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/'+issue+'/', null, function(response) {
			//console.error(response);
			App.View.LoadIssue(response);
		});
	};

	var UpdateIssue = function(user_repo, issue, method) {
		$$.ajax({type: "PUT", url: 'https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/'+issue+'/',
        	data: data, dataType: 'json', contentType: "application/x-www-form-urlencoded", success: function(response) {
        		// Do stuff
        	}
		});
	};

	var SearchIssues = function(user_repo, method){
		var searchBoxContent = lng.dom('#repo-issues-search').val();
		console.log('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/?search='+searchBoxContent);
		lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/?search='+searchBoxContent, null, function(response) {
			//console.log(response);
			console.log('success');
		});
	};

	/*$$.ajax({
        type: "PUT", // GET, POST, PUT, DELETE
        url: 'https://api.bitbucket.org/1.0/repositories/'+user_repo+'/issues/'+issue+'/',
        data: data,
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded", //defaults to null
        success: success // function(response)...
      });*/

	return {
		SetBasicAuth: SetBasicAuth,
		CheckLogin: CheckLogin,
		UserInfo: UserInfo,
		UserRecent: UserRecent,
		RepoList: RepoList,
		RepoRecent: RepoRecent,
		RepoCommits: RepoCommits,
		PostCommitComments:PostCommitComments,
		RepoIssues: RepoIssues,
		RepoSource: RepoSource,
		CommitDetail: CommitDetail,
		CommitComments: CommitComments,
		IssueDetail: IssueDetail,
		IssueComments: IssueComments,
		PostIssue: PostIssue,
		LoadIssue: LoadIssue,
		UpdateIssue: UpdateIssue
	};

})(LUNGO, App);