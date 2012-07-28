App.Data = (function(lng, app, undefined) {

	var ClearSessionStorage = function() {
		var dataStore = window.sessionStorage;
		dataStore.clear();
	};

	var ClearLocalStorage = function() {
		var localData = window.localStorage;
		localData.clear();
	};

	var CurrentRepo = function(repo) {
		if (repo) {
			lng.Data.Storage.session('current_repo', repo);
		} else {
			return lng.Data.Storage.session('current_repo');
		}
	};

	var CurrentRepoType = function(type) {
		if (type) {
			lng.Data.Storage.session('current_scm', type);
		} else {
			return lng.Data.Storage.session('current_scm');
		}
	};

	var CurrentCommit = function(commit) {
		if (commit) {
			lng.Data.Storage.session('current_commit', commit);
		} else {
			return lng.Data.Storage.session('current_commit');
		}
	};

	var CurrentCommitDesc = function(description) {
		if (description) {
			lng.Data.Storage.session('current_commit_desc', description);
		} else {
			return lng.Data.Storage.session('current_commit_desc');
		}
	};

	var LastCommit = function(commit) {
		if (commit) {
			lng.Data.Storage.session('last_commit', commit);
		} else {
			return lng.Data.Storage.session('last_commit');
		}
	};

	var CurrentPath = function() {
		var path_history = lng.Data.Storage.session('path_history');
		var path = (path_history) ? path_history.join('/') : '';
		return path; // Returns current URL
	};

	// Add the current path to the source browsing history
	var StorePath = function(path) {
		if (lng.Data.Storage.session('path_history')) {
			var path_history = lng.Data.Storage.session('path_history');
			path_history.push(path);
			lng.Data.Storage.session('path_history', path_history);
			return path_history.join('/'); // Returns new URL
		} else {
			var path_history = [];
			path_history.push(path);
			lng.Data.Storage.session('path_history', path_history);
			return path_history.join('/'); // Returns new URL
		}
	};

	// Goes one level back into the history and deletes the item
	var PathBack = function() {
		var path_history = lng.Data.Storage.session('path_history');
		path_history.pop(); // Removes current history level
		lng.Data.Storage.session('path_history', path_history);
		return path_history.join('/'); // Returns previous URL
	};

	var CurrentIssue = function(issue) {
		if (issue) {
			lng.Data.Storage.session('current_issue', issue);
		} else {
			return lng.Data.Storage.session('current_issue');
		}
	};

	var CurrentIssueQuery = function(query) {
		//console.log('CurrentIssueQuery: Received type '+typeof(query)', value "'+query+'"');
		if (query === undefined) {
			// CurrentIssueQuery(): Return the current search query
			return sessionStorage.current_issue_query;
		} else {
			// CurrentIssueQuery('string'): Store the search query
			sessionStorage.current_issue_query = query;
		}
	};

	var CurrentIssueDesc = function(description) {
		if (description) {
			lng.Data.Storage.session('current_issue_desc', description);
		} else {
			return lng.Data.Storage.session('current_issue_desc');
		}
	};

	var LastIssue = function(issue) {
		if (issue) {
			lng.Data.Storage.session('last_issue', issue);
		} else {
			return lng.Data.Storage.session('last_issue');
		}
	};

	var IssueComponents = function(components) {
		if (components) {
			lng.Data.Storage.session('issue_components', components);
		} else {
			return lng.Data.Storage.session('issue_components');
		}
	};

	var IssueMilestones = function(milestones) {
		if (milestones) {
			lng.Data.Storage.session('issue_milestones', milestones);
		} else {
			return lng.Data.Storage.session('issue_milestones');
		}
	};

	var IssueVersions = function(versions) {
		if (versions) {
			lng.Data.Storage.session('issue_versions', versions);
		} else {
			return lng.Data.Storage.session('issue_versions');
		}
	};

	var IssueUsers = function(users) {
		if (users) {
			lng.Data.Storage.session('issue_users', users);
		} else {
			return lng.Data.Storage.session('issue_users');
		}
	};
	
	return {
		ClearSessionStorage: ClearSessionStorage,
		ClearLocalStorage: ClearLocalStorage,
		CurrentRepo: CurrentRepo,
		CurrentRepoType: CurrentRepoType,
		CurrentCommit: CurrentCommit,
		CurrentCommitDesc: CurrentCommitDesc,
		LastCommit: LastCommit,
		CurrentPath: CurrentPath,
		StorePath: StorePath,
		PathBack: PathBack,
		CurrentIssue: CurrentIssue,
		CurrentIssueQuery: CurrentIssueQuery,
		CurrentIssueDesc: CurrentIssueDesc,
		LastIssue: LastIssue,
		IssueComponents: IssueComponents,
		IssueMilestones: IssueMilestones,
		IssueVersions: IssueVersions,
		IssueUsers: IssueUsers
	};

})(LUNGO, App);