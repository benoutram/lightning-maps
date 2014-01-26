Template.toolsControl.events({
	'click #addMarker' : function(event, template) {
		var title = 'Sample Title';
		var description = 'Sample Description';
		
		// get map center
		var center = LightningMaps.map().center();
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
		
		LightningMaps.map().markerControl.show();
	},
	'click #geolocation' : function(event, template) {
		LightningMaps.map().geolocate();
	},
	'click #center' : function(event, template) {
		LightningMaps.map().centerControl.show();
	}
});