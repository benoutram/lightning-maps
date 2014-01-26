Template.centerControl.events({
	'click #center' : function(event, template) {
		var latitude = parseFloat(template.find("#latitude").value, 10);
		var longitude = parseFloat(template.find("#longitude").value, 10);
		LightningMaps.map().centerOnCoords(latitude, longitude, 19);
	}
});