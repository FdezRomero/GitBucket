App.Events = (function(lng, app, undefined) {

    lng.dom('section#home header a#refresh').tap(function(event) {
	    
	    /*lng.Data.Sql.select('pictures', null, function(result) {
		    	console.error(result);
		    	if (result.length > 0) { //Tenemos datos en la DB
			    		App.View.pictures(result);
		    	} else {
			    		App.Services.panoramioPictures();
		    	}
	    });*/
	    
	    App.Services.Source('streamsocial', 'animales');
	    App.Services.Recent('streamsocial', 'animales');
	    
    });
    
    /*lng.dom('article#source li').tap(function(event) {
	    	var picture = lng.dom(this);
	    	//console.error(picture.attr('id'));
    });*/
    
    return {

    }

})(LUNGO, App);