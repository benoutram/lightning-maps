Template.addMarkerControl.events({
	'click #addMarker' : function(event, template) {
		var title = template.find("#markerTitle").value;
		var description = template.find("#markerDescription").value;
		var latitude = parseFloat(template.find("#markerLatitude").value, 10);
		var longitude = parseFloat(template.find("#markerLongitude").value, 10);

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
	}
});