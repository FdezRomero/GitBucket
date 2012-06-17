App.Utils = (function(lng, undefined) {

    //Non-LungoJS module for JS utilities
    var EventIcon = function (event) {
		switch(event) {
			case 'create': return 'add';
			case 'commit': return 'check';
		}
	};
    
    return {
		EventIcon: EventIcon
    };

})(LUNGO);