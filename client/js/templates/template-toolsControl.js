Template.toolsControl.events({
	'click #addMarker' : function(event, template) {
		var title = 'Sample Title';
		var description = 'Sample Description';

		// get map center
		var center = LightningMaps.map().center();
		var latitude = center.lat();
		var longitude = center.lng();

		Meteor.call('createMarker', {
			id : Random.id(),
			title : title,
			description : description,
			latitude : latitude,
			longitude : longitude
		}, function(error, result) {
			if (typeof error !== 'undefined') {
				console.log(error);
			}
		});
	},
	'click #geolocation' : function(event, template) {
		LightningMaps.map().geolocate();
	},
	'click #center' : function(event, template) {
		Session.set('centerControlVisible', true);
	},
	'click #accidentLayer' : function(event, template) {
		if (Session.get('accidentLayerVisible')) {
			LightningMaps.map().accidentLayerHide();
		} else {
			LightningMaps.map().accidentLayer();
			Session.set('accidentLayerVisible', true);
		}
	},
	'click #penaltyPostcodeLayer' : function(event, template) {
		if (Session.get('penaltyPostcodeLayerVisible')) {
			LightningMaps.map().penaltyPostcodeLayerHide();
		} else {
			LightningMaps.map().penaltyPostcodeLayer();
			Session.set('penaltyPostcodeLayerVisible', true);
		}
	}
});