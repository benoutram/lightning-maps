// Subscribe to additional User fields
Meteor.subscribe("userData");

// Collection subscriptions
var accidentDayOfWeek = "5"; // Friday
Meteor.subscribe("accident", accidentDayOfWeek);
Meteor.subscribe("markers");
Meteor.subscribe("penaltyPostcode");

// Default values for determining visibility
Session.setDefault('mapInitialised', false);
Session.setDefault('accidentLayerVisible', false);
Session.setDefault('penaltyPostcodeLayerVisible', false);
Session.setDefault('markerControlVisible', false);
Session.setDefault('centerControlVisible', false);