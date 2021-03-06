window.LightningMaps = window.LightningMaps || {};

LightningMaps.map = function() {
	if (typeof (this.singleton) === 'undefined') {
		var Map = function() {
		};
		Map.prototype = {
			init : function() {
				this.infoWindows = [];
				this.markers = [];
				_this = this;
				GoogleMaps.init({
					'sensor' : false,
					'key' : LightningMaps.GOOGLE_API_KEY,
					//'language' : 'zh-CN',
					'language' : 'en-GB',
					'region' : 'hk',
					'libraries' : 'visualization'
				}, function() {
					// callback
					_this.geocoder = new google.maps.Geocoder();
					_this.gmap = new google.maps.Map(document
							.getElementById("map-canvas"), _this.mapOptions());
				});
			},
			mapOptions : function() {
				return {
					panControl : false,
					zoomControl : true,
					zoomControlOptions : {
						style : google.maps.ZoomControlStyle.SMALL,
						position : google.maps.ControlPosition.RIGHT_TOP
					},
					mapTypeControl : true,
					scaleControl : true,
					streetViewControl : false,
					overviewMapControl : true,
					overviewMapControlOptions : {
						opened : false,
					},
					zoom : LightningMaps.DEFAULT_ZOOM,
					center : new google.maps.LatLng(
							LightningMaps.DEFAULT_POS.latitude,
							LightningMaps.DEFAULT_POS.longitude),
					styles : [ LightningMaps.DEFAULT_STYLE ],
				};
			},
			accidentLayerShow : function() {
				var markers = [];

				Accident.find({}, {
					"Latitude" : 1,
					"Longitude" : 1
				}).forEach(
						function(accidentDoc) {
							markers.push(new google.maps.Marker({
								"position" : new google.maps.LatLng(
										accidentDoc.Latitude,
										accidentDoc.Longitude)
							}));
						});
				this.accidentLayer = this.clusterMap(markers);
			},
			accidentLayerHide : function() {
				this.accidentLayer.clearMarkers();
			},
			addMarker : function(markerVal) {
				if (!this.gmap) {
					console.log('Not initialised yet');
				} else {
					var existingMarker = this.existingMarker(markerVal);
					if (_.isUndefined(existingMarker)) {
						// marker doesn't exist so add it
						/*
						 * var infobox = new InfoBox( { content : document
						 * .getElementById("infobox"), disableAutoPan : false,
						 * maxWidth : 150, pixelOffset : new
						 * google.maps.Size(-140, 0), zIndex : null, boxStyle : {
						 * background :
						 * "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif')
						 * no-repeat", opacity : 0.75, width : "280px" },
						 * closeBoxMargin : "12px 4px 2px 2px", closeBoxURL :
						 * "http://www.google.com/intl/en_us/mapfiles/close.gif",
						 * infoBoxClearance : new google.maps.Size(1, 1) }); var
						 * infowindow = new google.maps.InfoWindow({ content : '<div
						 * id="content"><p>' + markerVal.description + '</p></div>'
						 * });
						 */
						var marker = new google.maps.Marker({
							map : this.gmap,
							draggable : true,
							animation : google.maps.Animation.DROP,
							title : markerVal.title,
							icon : LightningMaps.POINTER,
							position : new google.maps.LatLng(
									markerVal.latitude, markerVal.longitude)
						});
						/*
						 * google.maps.event.addListener(marker, 'click',
						 * function(event) { infobox.open(this.gmap, this); });
						 */
						google.maps.event
								.addListener(marker, 'click',
										function(event) {
											Session.set('markerControlVisible',
													true);
											Session.set('markerSelected',
													markerVal.id);
										});
						google.maps.event.addListener(marker, 'dragend',
								function(event) {
									var latitude = event.latLng.d;
									var longitude = event.latLng.e;
									Meteor.call('updateMarker', {
										id : markerVal.id,
										title : markerVal.title,
										description : markerVal.description,
										latitude : latitude,
										longitude : longitude
									}, function(error, result) {
										if (typeof error !== 'undefined') {
											console.log(error);
										}
									});
								});
						markerVal.marker = marker;
						this.markers.push(markerVal);
					} else {
						// compare the new and existing markers to check if the
						// position needs updating
						if (this.markerMoved(existingMarker, markerVal)) {
							// TODO position only really needs updating if it
							// wasn't this client which dragged it
							existingMarker.marker
									.setPosition(new google.maps.LatLng(
											markerVal.latitude,
											markerVal.longitude));
						}
					}
				}
			},
			/**
			 * Return the LatLng of the map center.
			 */
			center : function() {
				return this.gmap.getCenter();
			},
			centerOnCoords : function(latitude, longitude, zoom) {
				this
						.centerOn(new google.maps.LatLng(latitude, longitude),
								zoom);
			},
			centerOn : function(position, zoom) {
				this.gmap.panTo(position);
				if (_.isNumber(zoom)) {
					this.zoom(zoom);
				}
			},
			clusterMap : function(markers) {
				return new MarkerClusterer(this.gmap, markers);
			},
			/**
			 * Retrieve a marker that has already been added to the map.
			 * 
			 * @param {Object}
			 *            markerVal
			 */
			existingMarker : function(markerVal) {
				return _.find(this.markers, function(marker) {
					return marker['id'] === markerVal['id'];
				});
			},
			geocode : function(address, callback) {
				this.geocoder.geocode({
					address : address
				}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK) {
						if (results[0]) {
							callback(results[0].geometry.location,
									results[0].formatted_address);
						}
					} else {
						console.log('Geocoder failed due to: ' + status);
					}
				});
			},
			geolocate : function() {
				var _this = this;
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
							function(position) {
								var position = new google.maps.LatLng(
										position.coords.latitude,
										position.coords.longitude);
								_this.centerOn(position, 19);
								_this.reverseGeocode(position,
										function(address) {
											_this.infoWindow(position,
													'<i class="fa fa-location-arrow"></i> '
															+ address);
										});
							}, function() {
								console.log('No geolocation');
							});
				}
			},
			heatMap : function(data) {
				var heatMap = new google.maps.visualization.HeatmapLayer({
					data : data,
					gradient : LightningMaps.HEATMAP_GRADIENT,
					maxIntensity : 10000,
					dissipating : true,
					radius : 20
				});
				heatMap.setMap(this.gmap);
				return heatMap;
			},
			infoWindow : function(position, content) {
				// close any existing infoWindows first
				_.each(this.infoWindows, function(infoWindow) {
					infoWindow.close();
				});
				// create a new infoWindow
				this.infoWindows.push(new google.maps.InfoWindow({
					map : this.gmap,
					position : position,
					content : content
				}));
			},
			penaltyPostcodeLayerShow : function() {
				var data = [];
				PenaltyPostcode
						.find({}, {
							"Latitude" : 1,
							"Longitude" : 1,
							"Total" : 1
						})
						.forEach(
								function(penaltyPostcodeDoc) {
									if (_.isNumber(penaltyPostcodeDoc.Latitude)
											&& _
													.isNumber(penaltyPostcodeDoc.Longitude)) {
										data
												.push({
													location : new google.maps.LatLng(
															penaltyPostcodeDoc.Latitude,
															penaltyPostcodeDoc.Longitude),
													weight : penaltyPostcodeDoc.Total
												});
									} else {
										// console.log('No location found for: '
										// + penaltyPostcodeDoc.District);
									}
								});
				this.penaltyPostcodeLayer = this.heatMap(data);
			},
			penaltyPostcodeLayerHide : function() {
				this.penaltyPostcodeLayer.setMap(null);
			},
			removeMarker : function(markerVal) {
				var markerVal = this.existingMarker(markerVal);
				if (!_.isUndefined(markerVal)) {
					markerVal.marker.setMap(null);
				}
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
			zoom : function(level) {
				this.gmap.setZoom(level);
			},
			/**
			 * Find if a marker added to the map has since been moved.
			 * 
			 * @param {Object}
			 *            originalMarker
			 * @param {Object}
			 *            newMarker
			 */
			markerMoved : function(originalMarker, newMarker) {
				return originalMarker['latitude'] !== newMarker['latitude']
						|| originalMarker['longitude'] !== newMarker['longitude'];
			}
		};
		this.singleton = new Map();
	}
	return this.singleton;
};
