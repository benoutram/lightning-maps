// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "markers".

var gMap = new GMap();

// Subscribe to additional User fields
Meteor.subscribe("userData");

Template.map.rendered = function() {
	if (!Session.get('map')) {
		// initialise the map
		gMap.init(53.375646964321525, -1.4694486506082045);
		Session.set('map', true);
	}

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
			gMap.addMarker(markerVal);
		});
	});
};

Template.addMarkerControl.events({
	'click #addMarker' : function(event, template) {
		console.log('add marker');
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

Template.configurationControl.helpers({
	configuration : function() {
		return Meteor.user().configuration;
	},
	pan : function() {
		return userHasControl('pan') ? 'checked' : '';
	},
	zoom : function() {
		return userHasControl('zoom') ? 'checked' : '';
	},
	mapType : function() {
		return userHasControl('mapType') ? 'checked' : '';
	},
	scale : function() {
		return userHasControl('scale') ? 'checked' : '';
	},
	streetView : function() {
		return userHasControl('streetView') ? 'checked' : '';
	},
	overview : function() {
		return userHasControl('overview') ? 'checked' : '';
	}
});

Template.configurationControl.events = {
	'blur .config-property' : function (event, template) {
		var property = 'configuration.' + event.target.id;

		var update = {};
		update[property] = event.target.value;

		Meteor.users.update(Meteor.userId(), {
			$set : update
		});
	},
	'click .config-control' : function (event, template) {
		var property = 'configuration.' + event.target.id;
		
		var update = {};
		update[property] = event.target.checked;
		
		Meteor.users.update(Meteor.userId(), {
			$set : update
		});
	}
};

Template.searchControl.events({
	'click #search' : function(event, template) {
		var address = template.find("#address").value;
		var center = gMap.search(address);
	}
});

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

function userHasControl(controlName) {
	if (!Meteor.user()) {
		return false;
	}
	return Meteor.user().configuration[controlName];
}