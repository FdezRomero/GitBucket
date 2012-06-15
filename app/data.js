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

    var StoreAuth = function(token) {
		
	};
    
    return {
		//cachePictures: cachePictures
		StoreAuth: StoreAuth
    };

})(LUNGO, App);