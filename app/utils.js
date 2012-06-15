App.Utils = (function(lng, undefined) {

    //Non-LungoJS module for JS utilities
    var BasicAuth = function (user, password) {
		return 'Basic ' + Base64.encode(user + ':' + password);
	};
    
    return {
		BasicAuth: BasicAuth
    };

})(LUNGO);