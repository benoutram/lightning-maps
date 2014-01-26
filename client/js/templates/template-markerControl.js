Template.markerControl.visible = function() {
	return Session.get('markerControlVisible');
};

Template.markerControl.events({
	'click #updateMarker' : function(event, template) {
		var title = template.find("#markerTitle").value;
		var description = template.find("#markerDescription").value;
		// TODO
	},
	'click #deleteMarker' : function(event, template) {
		Meteor.call('deleteMarker', Session.get('markerSelected'), function(error, result) {
			if ( typeof error === 'undefined') {
				Session.set('markerControlVisible', false);
			} else {
				console.log(error);
			}
		});
	}
});