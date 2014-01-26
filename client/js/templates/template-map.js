Template.map.rendered = function() {
	/*
	if (!Session.get('map')) {
		// initialise the map
		gMap.init(53.375646964321525, -1.4694486506082045);
		Session.set('map', true);
	}*/
    
	LightningMaps.map().init();
	
	console.log('registering autorun');
	Deps.autorun(function() {
		var markers = Markers.find().fetch();
		_.each(markers, function(marker) {
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
};