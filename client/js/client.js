// Subscribe to additional User fields
Meteor.subscribe("userData");

function userHasControl(controlName) {
	if (!Meteor.user()) {
		return false;
	}
	return Meteor.user().configuration[controlName];
}