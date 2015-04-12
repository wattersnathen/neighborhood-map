(function() {
    'use strict';

    $(document).ready(function() {
        ko.applyBindings(viewModel);
    });

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

    var viewModel = {
        googleMap: ko.observable({
            lat: ko.observable(40.015),
            lng: ko.observable(-105.27)
        })
    };

})();