var meetup = {
    key: '82d672183c733619762e644e64e2c',
    viewModel: {
        meetups: ko.observableArray([]),
        markers: ko.observableArray([])
    },
    getUpcomingMeetups: function(rad, zipCode, map) {
        var url = 'https://api.meetup.com/2/open_events?sign=true&photo-host=public&status=upcoming&zip=' + zipCode + '&radius=' + rad + '&key=' + meetup.key;
        $.ajax({
            url: url,
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
                $.each(data.results, function(index, value) {
                    // ignore results if they don't contain certain properties
                    if (!value.hasOwnProperty("venue")) {
                        return;
                    }
                    meetup.viewModel.meetups.push(value);
                    meetup.viewModel.markers.push(meetup.createMarker(value, map));
                });
            },
            error: function(error) {
                $('#results').text('Failed retrieving results from the Meetup API');
            }
        });
    },
    createMarker: function(value, map) {
        var pos = new google.maps.LatLng(value.venue.lat, value.venue.lon);
        var marker = new google.maps.Marker({
            position: pos,
            map: map
        });

        var date = moment(value.time).toDate();
        date = moment(date).format('MMMM Do YYYY, h:mm a');

        var content = 
            '<div class="infowindow">' +
                '<a href="' + value.event_url +'" target="_blank" class="eventurl">' +
                    '<h1>' + value.name + '</h1>' +
                '</a>' +
                '<p>' +
                    '<strong>' + date + '</strong>,&nbsp;' +
                    '<a href="http://www.meetup.com/' + value.group.urlname + '" target="_blank">' + value.group.name + '</a>' +
                '</p>' +
                '<p>' + value.venue.address_1 + '&nbsp;' + value.venue.city + ', ' + value.venue.state + '</p>' +
                '<p>' + value.description + '</p>' +
            '</div>';

        marker.info = new google.maps.InfoWindow({
            content: content
        });

        marker.id = value.id;

        marker.date = date;

        google.maps.event.addListener(marker, 'click', function() {
            for (var i in meetup.viewModel.markers()) {
                meetup.viewModel.markers()[i].info.close();
            }
            marker.info.open(map, marker);
        });

        return marker;
    }
};

// custom binding for handling the date format of the events returned.
ko.bindingHandlers.dateString = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        value = moment(value).toDate();
        $(element).text(moment(value).format('MMMM Do YYYY, h:mm a'));
    }
};