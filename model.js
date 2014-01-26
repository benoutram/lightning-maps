// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "markers".

Markers = new Meteor.Collection("markers");
Accident = new Meteor.Collection("accident");
PenaltyPostcode = new Meteor.Collection("penaltyPostcode");

Meteor.methods({
	createMarker : function(options) {
		check(options, {
			title : NonEmptyString,
			description : NonEmptyString,
			latitude : Coordinate,
			longitude : Coordinate
		});

		if (!this.userId) {
			throw new Meteor.Error(403, "You must be logged in");
		}

		var id = Random.id();
		Markers.insert({
			_id : id,
			owner : this.userId,
			title : options.title,
			description : options.description,
			latitude : options.latitude,
			longitude : options.longitude
		});
		return id;
	},
	updateMarker : function(markerVal) {
		Markers.update(markerVal.id, {
			$set : {
				title : markerVal.title,
				description : markerVal.description,
				latitude : markerVal.latitude,
				longitude : markerVal.longitude
			}
		});
	}
});

var NonEmptyString = Match.Where(function(x) {
	check(x, String);
	return x.length !== 0;
});

var Coordinate = Match.Where(function(x) {
	check(x, Number);
	return true;
});