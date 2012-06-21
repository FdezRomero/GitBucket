App.Data = (function(lng, app, undefined) {

	/*lng.Data.Sql.init({
		name: 'panoramio-example-cache',
		version: '1.0',
		schema: [
			{
				name: 'pictures',
				drop: true,
				fields: {
					height: 'INTEGER',
					latitude: 'STRING',
					longitude: 'STRING',
					owner_id: 'INTEGER',
					owner_name: 'STRING',
					owner_url: 'STRING',
					photo_file_url: 'STRING',
					photo_id: 'INTEGER',
					place_id: 'STRING',
					photo_title: 'STRING',
					photo_url: 'STRING',
					upload_date: 'STRING',
					width: 'INTEGER'
				}
			}
		]
	});
	
	var cachePictures = function(pictures) {
		lng.Data.Sql.insert('pictures', pictures);
	};*/

	var ClearSessionStorage = function() {
		var dataStore = window.sessionStorage;
		dataStore.clear();
	};

	// Stores and provides the current repo in view
	var CurrentRepo = function(repo) {
		if (repo) {
			// Store the repo provided
			lng.Data.Storage.session('current_repo', repo);
		} else {
			// Return the current repo
			return lng.Data.Storage.session('current_repo');
		}
	};

	// Stores and provides the current repo SCM in view
	var CurrentRepoType = function(type) {
		if (type) {
			// Store the repo SCM provided
			lng.Data.Storage.session('current_scm', type);
		} else {
			// Return the current SCM repo
			return lng.Data.Storage.session('current_scm');
		}
	};

	// Stores and provides the current commit in view
	var CurrentCommit = function(commit) {
		if (commit) {
			// Store the commit provided
			lng.Data.Storage.session('current_commit', commit);
		} else {
			// Return the current commit
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

	// Add the current path to the source browsing history
	var StorePath = function(path) {
		if (lng.Data.Storage.session('path_history')) {
			var path_history = lng.Data.Storage.session('path_history');
			path_history.push(path);
			lng.Data.Storage.session('path_history', path_history);
			return path_history.join('/'); // Returns new URL
		} else {
			var path_history = new Array();
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

	// Stores and provides the current issue in view
	var CurrentIssue = function(issue) {
		if (issue) {
			// Store the issue provided
			lng.Data.Storage.session('current_issue', issue);
		} else {
			// Return the current issue
			return lng.Data.Storage.session('current_issue');
		}
	};

	var CurrentIssueDesc = function(description) {
		if (description) {
			lng.Data.Storage.session('current_issue_desc', description);
		} else {
			return lng.Data.Storage.session('current_issue_desc');
		}
	};

	// Stores and provides the Issue Components
	var IssueComponents = function(components) {
		if (components) {
			// Store the components provided
			lng.Data.Storage.session('issue_components', components);
		} else {
			// Return the current components
			return lng.Data.Storage.session('issue_components');
		}
	};

	// Stores and provides the Issue Milestones
	var IssueMilestones = function(milestones) {
		if (milestones) {
			// Store the milestones provided
			lng.Data.Storage.session('issue_milestones', milestones);
		} else {
			// Return the current milestones
			return lng.Data.Storage.session('issue_milestones');
		}
	};

	// Stores and provides the Issue Versions
	var IssueVersions = function(versions) {
		if (versions) {
			// Store the versions provided
			lng.Data.Storage.session('issue_versions', versions);
		} else {
			// Return the current versions
			return lng.Data.Storage.session('issue_versions');
		}
	};
	
	return {
		//cachePictures: cachePictures
		ClearSessionStorage: ClearSessionStorage,
		CurrentRepo: CurrentRepo,
		CurrentRepoType: CurrentRepoType,
		CurrentCommit: CurrentCommit,
		CurrentCommitDesc: CurrentCommitDesc,
		StorePath: StorePath,
		PathBack: PathBack,
		CurrentIssue: CurrentIssue,
		CurrentIssueDesc: CurrentIssueDesc,
		IssueComponents: IssueComponents,
		IssueMilestones: IssueMilestones,
		IssueVersions: IssueVersions
	};

})(LUNGO, App);