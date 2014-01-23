Meteor.startup(function() {
	// code to run on server at startup
	if (Markers.find().count() === 0) {
		Markers.insert({
			title : 'Test Marker 1',
			description : 'Test Marker 1 Description',
			latitude : 53.375646964321525,
			longitude : -1.4694486506082045
		});
	}
});

Accounts.onCreateUser(function(options, user) {
	// Set default Configuration options
	user.configuration = {
		apiVersion : '1.4',
		localisation : 'en-gb',
		regionalisation : 'hk',
		pan : true,
		zoom : true,
		mapType : true,
		scale : true,
		streetView : true,
		overview : true
	};
	// We still want the default hook's 'profile' behavior.
	if (options.profile) {
		user.profile = options.profile;
	}
	return user;
});

// Publish additional User fields 
Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId},
                           {fields: {'configuration': 1}});
});

// Allow changes to the User document
Meteor.users.allow({
	update: function() {
		return true;
	}
});