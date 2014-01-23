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