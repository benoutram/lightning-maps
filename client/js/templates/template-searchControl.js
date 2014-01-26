console.log('hello3');
Template.searchControl.events({
	'click #search' : function(event, template) {
		var address = template.find("#address").value;
		var center = LightningMaps.map().search(address);
	}
});