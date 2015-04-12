function Map() {
    'use strict';

    var self = this;

    self.geocoder = new google.maps.Geocoder();

    self.viewModel = {
        googleMap: ko.observable({
            lat: ko.observable(),
            lng: ko.observable()
        })
    };

    self.getCurrentPosition = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                // geolocation exists and user allowed
                function success(position) {
                    self.viewModel.googleMap().lat(position.coords.latitude);
                    self.viewModel.googleMap().lng(position.coords.longitude);
                },
                // geolocation exists, but user denied
                function error() {
                    self.setDefaultPosition();
                }
            );
        } else { // geolocation not defined
            self.setDefaultPosition();
        }
    };

    self.setDefaultPosition = function() {
        // coordinates for Boulder, CO. where a lot of Meetups usually are
        self.viewModel.googleMap().lat(40.015);
        self.viewModel.googleMap().lng(-105.27);
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
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            mapObj.googleMap = new google.maps.Map(element, mapOptions);

            mapObj.onChangeCoord = function(newValue) {
                var latLng = new google.maps.LatLng(
                    ko.utils.unwrapObservable(mapObj.lat),
                    ko.utils.unwrapObservable(mapObj.lng)
                );
                mapObj.googleMap.setCenter(latLng);
            };

            mapObj.lat.subscribe(mapObj.onChangeCoord);
            mapObj.lng.subscribe(mapObj.onChangeCoord);
        }
    };
}