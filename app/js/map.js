function Map() {
    'use strict';

    var self = this;

    self.map = {};

    // Reference to the current center of the map.
    // TODO: Calculate the radius from the center of the map's current position
    //       and use that as the radius parameter in the Meetup API request.
    self.center = {};

    self.searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));

    // Use Google's Geocoder to get latitude and longitude from an address and vice-versa
    self.geocoder = new google.maps.Geocoder();

    self.viewModel = {
        googleMap: ko.observable({
            lat: ko.observable(),
            lng: ko.observable()
        }),
        address: ko.observable(),
        meetups: meetup.viewModel.meetups,
        markers: meetup.viewModel.markers,
        clickMarker: function(data) {
            for (var idx = 0; idx < self.viewModel.meetups().length; idx++) {
                var marker = self.viewModel.markers()[idx];
                if (marker.open) {
                    marker.open = false;
                    marker.info.close();
                }
                if (marker.id == data.id) {
                    marker.open = true;
                    marker.info.open(self.map, marker);
                    self.map.panTo(marker.getPosition());
                }
            }
        }
    };

    // BUG: getCurrentPosition is the culprit for Google maps not rendering fully 
    self.getCurrentPosition = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // geolocation exists and user allowed
                function success(position) {
                    self.lat = position.coords.latitude;
                    self.lng = position.coords.longitude;
                    self.viewModel.googleMap().lat(self.lat);
                    self.viewModel.googleMap().lng(self.lng);
                    self.getLocationFromLatLng(self.viewModel.googleMap().lat(), self.viewModel.googleMap().lng());
                },
                // geolocation exists, but user denied
                function error() {
                    self.setDefaultPosition();
                }
            );
        } else {
            // geolocation not defined
            self.setDefaultPosition();
        }
    };

    self.getLocationFromLatLng = function(latitude, longitude) {
        var pos = new google.maps.LatLng(latitude, longitude);
        meetup.viewModel.meetups([]);
        for (var idx = 0, markersLen = meetup.viewModel.markers().length; idx < markersLen; idx++) {
            meetup.viewModel.markers()[idx].setMap(null);
        }
        meetup.viewModel.markers([]);
        if (pos.A && pos.F) {
            meetup.getUpcomingMeetups(10, pos, self.map);
            self.viewModel.address(pos);
        }
    };
    /*
     * Sets the default position to use on page load if geolocation doesn't work
     */
    self.setDefaultPosition = function() {
        // coordinates for Boulder, CO. where a lot of Meetups usually are
        self.lat = 40.015;
        self.lng = -105.27;
        
        self.viewModel.googleMap().lat(self.lat);
        self.viewModel.googleMap().lng(self.lng);
        
        self.getLocationFromLatLng(self.viewModel.googleMap().lat(), self.viewModel.googleMap().lng());
                
    };

    /*
     * Knockout.js binding for a Google Maps object
     */
    ko.bindingHandlers.map = {
        init: function (element, valueAccessor, allBindings, viewModel) {
            var mapObj = ko.utils.unwrapObservable(valueAccessor());
            var latLng = new google.maps.LatLng(
                ko.utils.unwrapObservable(mapObj.lat),
                ko.utils.unwrapObservable(mapObj.lng)
            );
            var mapOptions = {
                center: latLng,
                zoom: 12,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                panControlOptions: {
                    position: google.maps.ControlPosition.TOP_RIGHT
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            mapObj.googleMap = new google.maps.Map(element, mapOptions);
            
            self.map = mapObj.googleMap;

            // change map location when coordinates change
            mapObj.onChangeCoord = function(newValue) {
                var latLng = new google.maps.LatLng(
                    ko.utils.unwrapObservable(mapObj.lat),
                    ko.utils.unwrapObservable(mapObj.lng)
                );
                mapObj.googleMap.setCenter(latLng);

                // get the center of the map every time the user searches a new location
                self.center = mapObj.googleMap.getCenter();
                self.getLocationFromLatLng(self.center.A, self.center.F);
            };
            
            google.maps.event.addListenerOnce(mapObj.googleMap, 'idle', function () {
                google.maps.event.trigger(mapObj.googleMap, 'resize');
            });

            // event fires after user finishes dragging map
            google.maps.event.addListener(mapObj.googleMap, 'dragend', function() {

                // get the updated coordinates for the center of the map
                self.center = mapObj.googleMap.getCenter();
                self.getLocationFromLatLng(self.center.A, self.center.F);
            });

            // user changes location from within the search box
            google.maps.event.addListener(self.searchBox, 'places_changed', function() {
                var places = self.searchBox.getPlaces();
                var lat = places[0].geometry.location.A;
                var lng = places[0].geometry.location.F;
                self.getLocationFromLatLng(lat, lng);
                self.viewModel.googleMap().lat(lat);
                self.viewModel.googleMap().lng(lng);
            });        
            
            google.maps.event.addDomListener(window, 'resize', function () {
                var center = self.map.getCenter();
                google.maps.event.trigger(self.map, 'resize');
                self.map.setCenter(center);
            });

            mapObj.lat.subscribe(mapObj.onChangeCoord); // listen to coordinates changed events
            mapObj.lng.subscribe(mapObj.onChangeCoord); // ''
        }
    };
}