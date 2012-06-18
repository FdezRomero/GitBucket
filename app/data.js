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
	
	return {
		//cachePictures: cachePictures
		ClearSessionStorage: ClearSessionStorage,
		StorePath: StorePath,
		PathBack: PathBack
	};

})(LUNGO, App);