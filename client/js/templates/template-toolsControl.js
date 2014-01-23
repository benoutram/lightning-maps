Template.toolsControl.events({
	'click #addMarker' : function(event, template) {
		var title = 'Sample Title';
		var description = 'Sample Description';
		
		// get map center
		var center = gMap.center();
		var latitude = center.lat();
		var longitude = center.lng();
		
		Meteor.call('createMarker', {
			title : title,
			description : description,
			latitude : latitude,
			longitude : longitude
		}, function(error, result) {
			if ( typeof error !== 'undefined') {
				console.log(error);
			}
		});
		
		gMap.markerControl.show();
	},
	'click #geolocation' : function(event, template) {
		gMap.geolocate();
	},
	'click #center' : function(event, template) {
		gMap.centerControl.show();
	}
});