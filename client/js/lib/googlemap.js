GMap = function() {
};

GMap.prototype = {
	init : function(latitude, longitude) {
		this.geocoder = new google.maps.Geocoder();
		this.map = new google.maps.Map(document.getElementById("map-canvas"), this.mapOptions(latitude, longitude));
		this.infoWindows = [];
		this.markers = [];
		this.initControls();
	},
	initControls : function() {
		this.configurationControl = new MapControl(this.map, google.maps.ControlPosition.RIGHT_BOTTOM, Meteor.render(function() {
			return Template.configurationControl({
			});
		}));
		this.centerControl = new MapControl(this.map, google.maps.ControlPosition.RIGHT_BOTTOM, Meteor.render(function() {
			return Template.centerControl({
			});
		}));
		this.markerControl = new MapControl(this.map, google.maps.ControlPosition.RIGHT_BOTTOM, Meteor.render(function() {
			return Template.addMarkerControl({
			});
		}));
		this.searchControl = new MapControl(this.map, google.maps.ControlPosition.TOP_CENTER, Meteor.render(function() {
			return Template.searchControl({
			});
		}));
		this.toolsControl = new MapControl(this.map, google.maps.ControlPosition.TOP_LEFT, Meteor.render(function() {
			return Template.toolsControl({
			});
		}));
		
		this.configurationControl.show();
		this.searchControl.show();
		this.toolsControl.show();
	},
	mapOptions : function(latitude, longitude) {
		return {
			//disableDefaultUI : true,
			zoom : 17,
			center : new google.maps.LatLng(latitude, longitude),
			styles : [GMap.DEFAULT_STYLE],
		};
	},
	addControl : function(position, controlNode) {
		this.map.controls[position].push(controlNode.firstChild);
		document.body.appendChild(controlNode);
	},
	addMarker : function(markerVal) {
		if (!this.map) {
			console.log('Not initialised yet');
		} else {
			var existingMarker = this.existingMarker(markerVal);
			if (_.isUndefined(existingMarker)) {
				// marker doesn't exist so add it
				var infobox = new InfoBox({
					content : document.getElementById("infobox"),
					disableAutoPan : false,
					maxWidth : 150,
					pixelOffset : new google.maps.Size(-140, 0),
					zIndex : null,
					boxStyle : {
						background : "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
						opacity : 0.75,
						width : "280px"
					},
					closeBoxMargin : "12px 4px 2px 2px",
					closeBoxURL : "http://www.google.com/intl/en_us/mapfiles/close.gif",
					infoBoxClearance : new google.maps.Size(1, 1)
				});
				var infowindow = new google.maps.InfoWindow({
					content : '<div id="content"><p>' + markerVal.description + '</p></div>'
				});
				var marker = new google.maps.Marker({
					map : this.map,
					draggable : true,
					animation : google.maps.Animation.DROP,
					title : markerVal.title,
					icon : GMapMarkers.POINTER,
					position : new google.maps.LatLng(markerVal.latitude, markerVal.longitude)
				});
				google.maps.event.addListener(marker, 'click', function(event) {
					infobox.open(this.map, this);
				});
				google.maps.event.addListener(marker, 'click', function(event) {
					console.log(event);
				});
				google.maps.event.addListener(marker, 'dragend', function(event) {
					var latitude = event.latLng.ob;
					var longitude = event.latLng.pb;
					Meteor.call('updateMarker', {
						id : markerVal.id,
						title : markerVal.title,
						description : markerVal.description,
						latitude : latitude,
						longitude : longitude
					}, function(error, result) {
						if ( typeof error !== 'undefined') {
							console.log(error);
						}
					});
				});
				markerVal.marker = marker;
				this.markers.push(markerVal);
			} else {
				// compare the new and existing markers to check if the position needs updating
				if (this.markerMoved(existingMarker, markerVal)) {
					// TODO position only really needs updating if it wasn't this client which dragged it
					existingMarker.marker.setPosition(new google.maps.LatLng(markerVal.latitude, markerVal.longitude));
				}
			}
		}
	},
	/**
	 * Return the LatLng of the map center.
	 */
	center : function() {
		return this.map.getCenter();
	},
	centerOn : function(position) {
		this.map.setCenter(position);
	},
	geocode : function(address, callback) {
		this.geocoder.geocode({
			address : address
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					callback(results[0].geometry.location, results[0].formatted_address);
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}
		});
	},
	geolocate : function() {
		var _this = this;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				_this.centerOn(position);
				_this.reverseGeocode(position, function(address) {
					_this.infoWindow(position, address);
				});
			}, function() {
				console.log('No geolocation');
			});
		}
	},
	infoWindow : function(position, content) {
		// close any existing infoWindows first
		_.each(this.infoWindows, function(infoWindow) {
			infoWindow.close();
		});
		// create a new infoWindow
		this.infoWindows.push(new google.maps.InfoWindow({
			map : this.map,
			position : position,
			content : content
		}));
	},
	removeControl : function() {
		
	},
	reverseGeocode : function(position, callback) {
		this.geocoder.geocode({
			latLng : position
		}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					callback(results[1].formatted_address);
				} else {
					callback('Current location.');
				}
			} else {
				console.log('Geocoder failed due to: ' + status);
			}
		});
	},
	search : function(address) {
		var _this = this;
		this.geocode(address, function(position, address) {
			_this.centerOn(position);
			_this.infoWindow(position, address);
		});
	},
	/**
	 * Retrieve a marker that has already been added to the map.
	 * @param {Object} markerVal
	 */
	existingMarker : function(markerVal) {
		return _.find(this.markers, function(marker) {
			return marker['id'] === markerVal['id'];
		});
	},
	/**
	 * Find if a marker added to the map has since been moved.
	 * @param {Object} originalMarker
	 * @param {Object} newMarker
	 */
	markerMoved : function(originalMarker, newMarker) {
		return originalMarker['latitude'] !== newMarker['latitude'] || originalMarker['longitude'] !== newMarker['longitude'];
	}
};

GMap.DEFAULT_STYLE = {
	featureType : 'all',
	stylers : [{
		hue : '#e2bbc8'
	}, {
		//invert_lightness : 'true'
	}, {
		saturation : -30
	}]
};
