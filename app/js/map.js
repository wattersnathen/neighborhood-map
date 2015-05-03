function Map() {
    'use strict';

    var self = this;

    // Reference to the current center of the map.
    // Used for searching Meetups within 'x' amount of miles from the current center
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
        meetups: meetup.viewModel.meetups
    };    

    self.getCurrentPosition = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // geolocation exists and user allowed
                function success(position) {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    self.viewModel.googleMap().lat(lat);
                    self.viewModel.googleMap().lng(lng);
                    self.getLocationFromLatLng(lat, lng)
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
        self.geocoder.geocode({ 'latLng': pos }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var addr = '';
                for (var i = 0, len = results[0].address_components.length; i < len; i++) {
                    if (results[0].address_components[i].types[0] === 'locality') {
                        addr += results[0].address_components[i].long_name + ', ';
                    }
                    if (results[0].address_components[i].types[0] === 'administrative_area_level_1') {
                        addr += results[0].address_components[i].short_name + ' ';
                    }
                    if (results[0].address_components[i].types[0] === 'postal_code') {
                        addr += results[0].address_components[i].long_name;
                    }
                }
                self.viewModel.address(addr);
            }
        });
    };

    self.setDefaultPosition = function() {
        // coordinates for Boulder, CO. where a lot of Meetups usually are
        self.viewModel.googleMap().lat(40.015);
        self.viewModel.googleMap().lng(-105.27);
        self.getLocationFromLatLng(self.viewModel.googleMap().lat(), self.viewModel.googleMap().lng());
    };

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

            // change map location when coordinates change
            mapObj.onChangeCoord = function(newValue) {
                var latLng = new google.maps.LatLng(
                    ko.utils.unwrapObservable(mapObj.lat),
                    ko.utils.unwrapObservable(mapObj.lng)
                );
                mapObj.googleMap.setCenter(latLng);

                // get the center of the map every time the user searches a new location
                self.center = mapObj.googleMap.getCenter();
            };

            // event fires after user finishes dragging map
            google.maps.event.addListener(mapObj.googleMap, 'dragend', function() {
                
                // get the updated coordinates for the center of the map
                self.center = mapObj.googleMap.getCenter();
            });

            google.maps.event.addListener(self.searchBox, 'places_changed', function() {
                var places = self.searchBox.getPlaces();
                var lat = places[0].geometry.location.k;
                var lng = places[0].geometry.location.D;
                self.getLocationFromLatLng(lat, lng);
                self.viewModel.googleMap().lat(lat);
                self.viewModel.googleMap().lng(lng);

            });

            mapObj.lat.subscribe(mapObj.onChangeCoord);
            mapObj.lng.subscribe(mapObj.onChangeCoord);
        }
    };
}