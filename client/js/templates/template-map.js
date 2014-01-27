Template.map.rendered = function() {
	if (Session.get('mapInitialised') !== true) {
		// already initialised
		LightningMaps.map().init();
		Session.set('mapInitialised', true);
	}

	Deps.autorun(function() {
		Markers.find().fetch().forEach(function(marker) {
			var markerVal = {
				id : marker._id,
				title : marker.title,
				description : marker.description,
				latitude : marker.latitude,
				longitude : marker.longitude
			};
			LightningMaps.map().addMarker(markerVal);
		});
	});

	var markersQuery = Markers.find({}, {fields : {}});
	var handle = markersQuery.observe({
		removed : function(marker) {
			var markerVal = {
				id : marker._id
			};
			LightningMaps.map().removeMarker(markerVal);
		}
	});
};