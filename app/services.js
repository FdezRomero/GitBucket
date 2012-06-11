App.Services = (function(lng, app, undefined) {
		
		$$.ajaxSettings.headers = {'Authorization': basic_auth('FdezRomero', 'PASSWORD')}; // Your credentials here!
		
		var Source = function(user, repo) {
			lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user+'/'+repo+'/src/master/', null, function(response) {
					//App.Data.cacheRepoEvents(response.photos);
					console.error(response);
					App.View.Source(response);
				});
		};
		
		var Recent = function(user, repo) {
			lng.Service.get('https://api.bitbucket.org/1.0/repositories/'+user+'/'+repo+'/events/', null, function(response) {
					console.error(response);
					App.View.Recent(response);
				});
		};

    return {
	    	Source: Source,
	    	Recent: Recent
    }

})(LUNGO, App);