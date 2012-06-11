App.View = (function(lng, app, undefined) {
		
		lng.View.Template.create('recent-tmpl',
				'<li>\
						<div class="onright">{{utc_created_on}}</div>\
						<a href="#"><span class="icon check mini"></span>{{event}}: {{description}}</a>\
				</li>'
		);
		
		lng.View.Template.create('source-dirs-tmpl',
				'<li id="{{directories}}">\
						<a href="#"><span class="icon folder mini"></span>{{directories}}</a>\
				</li>'
		);
		
		lng.View.Template.create('source-files-tmpl',
				'<li id="{{path}}">\
					<div class="onright">{{size}} B</div>\
					<span class="icon file"></span><a href="#">{{path}}</a>\
					<small>{{revision}}</small>\
				</li>'
		);
		
		var Recent = function(recent) {
				if (recent.count > 0) {
						lng.View.Template.List.create({
								el: '#recent',
								template: 'recent-tmpl',
								data: recent.events
						});
				} else {
						// Show there are no events yet
				}
		};
		
		var Source = function(source) {
				lng.View.Template.List.create({
						el: '#source',
						template: 'source-files-tmpl',
						data: source.files
				});
				lng.View.Template.List.prepend({
						el: '#source',
						template: 'source-dirs-tmpl',
						data: source
				});
		};

    return {
	    	Source: Source,
	    	Recent: Recent
    }

})(LUNGO, App);