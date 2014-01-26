// Subscribe to additional User fields
Meteor.subscribe("userData");

// Collection subscriptions
var accidentDayOfWeek = "5"; // Friday
Meteor.subscribe("accident", accidentDayOfWeek);
Meteor.subscribe("markers");
Meteor.subscribe("penaltyPostcode");

Session.setDefault('mapInitialised', false);

// Default values for determining control visibility
Session.setDefault('markerControlVisible', false);
Session.setDefault('centerControlVisible', false);