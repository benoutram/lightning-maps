// Subscribe to additional User fields
Meteor.subscribe("userData");

var accidentDayOfWeek="5";  // Friday

Meteor.subscribe("accident", accidentDayOfWeek);
Meteor.subscribe("penaltyPostcode");