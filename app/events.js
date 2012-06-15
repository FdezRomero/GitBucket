App.Events = (function(lng, app, undefined) {

    lng.dom('body').ready(function(event) {

    	//lng.Data.Storage.persistent('username', username);
    	//lng.Data.Storage.persistent('auth', Base64.encode(username+':Password'));

    	var username = lng.Data.Storage.persistent('username');

    	HideFooter();
    	lng.Data.Storage.session('current_title', username);
    	App.View.UpdateTitle(username);

    	App.Services.UserInfo();
    	App.Services.UserRecent();
    	App.Services.RepoList();
    });

    lng.dom('aside#aside-menu a').tap(function(event) {
    	
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

    lng.dom('section#main a#refresh').tap(function(event) {
	
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

    var UpdateRepo = function(user_repo, method) {
    	App.Services.RepoRecent(user_repo, method);
		App.Services.RepoSource(user_repo, method);
		App.Services.RepoCommits(user_repo, method);
    };

    var ShowFooter = function() {
    	lng.dom('#main footer').show();
    }

    var HideFooter = function() {
    	lng.dom('#main footer').hide();
    }
    
	/*lng.dom('article#source li').tap(function(event) {
		var picture = lng.dom(this);
		//console.error(picture.attr('id'));
    });*/
    
    return {

    };

})(LUNGO, App);