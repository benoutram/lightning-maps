LightningMaps = LightningMaps || {};

LightningMaps.GOOGLE_API_KEY = 'AIzaSyA5UPXabiWwdiV9mOwxsZSinfFIE-zUu3g';

LightningMaps.DEFAULT_ZOOM = 17;

LightningMaps.DEFAULT_POS = {
	'latitude' : 53.375646964321525,
	'longitude' : -1.4694486506082045
};

LightningMaps.DEFAULT_STYLE = {
	featureType : 'all',
	stylers : [ {
		hue : '#e2bbc8'
	}, {
		//invert_lightness : 'true'
	}, {
		saturation : -30
	} ]
};

LightningMaps.POINTER = {
	path : 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z',
	fillColor : '#333333',
	fillOpacity : 1.0,
	scale : 1,
	strokeColor : '#333333',
	strokeWeight : 1
};

LightningMaps.HEATMAP_GRADIENT = [ 'rgba(0, 255, 255, 0)',
		'rgba(0, 255, 255, 1)', 'rgba(0, 191, 255, 1)', 'rgba(0, 127, 255, 1)',
		'rgba(0, 63, 255, 1)', 'rgba(0, 0, 255, 1)', 'rgba(0, 0, 223, 1)',
		'rgba(0, 0, 191, 1)', 'rgba(0, 0, 159, 1)', 'rgba(0, 0, 127, 1)',
		'rgba(63, 0, 91, 1)', 'rgba(127, 0, 63, 1)', 'rgba(191, 0, 31, 1)',
		'rgba(255, 0, 0, 1)' ];