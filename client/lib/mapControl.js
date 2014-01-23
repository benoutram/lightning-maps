MapControl = function(map, position, node) {
	this.init(map, position, node);
};

MapControl.prototype = {
	init : function(map, position, node) {
		this.map = map;
		this.position = position;
		this.node = node;
		this.firstChild = this.node.firstChild;
		document.body.appendChild(this.node);
	},
	indexOf : function() {
		return _.indexOf(this.map.controls[this.position].getArray(), this.firstChild);
	},
	hide : function() {
		var index = this.indexOf();
		if (index >= 0) {
			this.map.controls[this.position].removeAt(index);
		}
	},
	move : function(position) {
		this.hide();
		this.position = position;
		this.show();
	},
	show : function() {
		if (this.indexOf() === -1) {
			this.map.controls[this.position].push(this.firstChild);
		}
	}
}; 