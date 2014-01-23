Template.searchControl.events({
	'click #search' : function(event, template) {
		var address = template.find("#address").value;
		var center = gMap.search(address);
	}
});