var today = moment(Date.now()); // today's Date

// Meetup object for dealing with the Meetup JavaScript API
var meetup = {
    key: '82d672183c733619762e644e64e2c',
    viewModel: {
        meetups: ko.observableArray([]),
        markers: ko.observableArray([])
    },

    /*
     * Get the Meetups that have an upcoming event date.
     * @param {Number} rad the radius to search from
     * @param {Object} Google Maps LatLng object
     * @param {Object} map a reference to the Google Maps object
     */
    getUpcomingMeetups: function (rad, pos, map) {
        var url = 'https://api.meetup.com/2/open_events?sign=true&photo-host=public&status=upcoming&lat=' + pos.A + '&lon=' + pos.F + '&radius=' + rad + '&key=' + meetup.key;
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

    /*
     * Create a Google Maps Marker to place on the map
     * @param {Object} value Meetup result returned from the API
     * @param {Object} map Reference to the Google Map used
     */
    createMarker: function(value, map) {
        var pos = new google.maps.LatLng(value.venue.lat, value.venue.lon);
        var date = moment(value.time).toDate();
        var icon;

        var isToday = moment(date).isSame(today, 'day');

        if (isToday) {
            // green icon for today's Meetups
            icon = 'icons/today1.png';
        } else if (moment(date).subtract(7, 'days') <= moment(today)) {
            // blue icon for this week's Meetups
            icon = 'icons/marker-th.png';
        } else {
            // red icon for all other upcoming Meetups
            icon = 'icons/map-pin-red-th.png';
        }

        // reformat the date for easier display in the markup
        date = moment(date).format('MMMM Do YYYY, h:mm a');

        // marker object to place on the map
        var marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: icon
        });

        if (isToday) {
            // bounce the marker if the Meetup is today
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }

        // InfoWindow content template
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

        // give each marker an InfoWindow
        marker.info = new google.maps.InfoWindow({
            content: content
        });

        marker.id = value.id;

        marker.date = date;

        marker.open = false;    // tracking the InfoWindow's status of either open or closed

        // user closes the InfoWindow
        google.maps.event.addListener(marker.info, 'closeclick', function() {
            marker.open = false;
        });

        // open/close the InfoWindow when marker is clicked
        google.maps.event.addListener(marker, 'click', function() {
            for (var idx = 0; idx < meetup.viewModel.markers().length; idx++) {
                if (meetup.viewModel.markers()[idx].id != marker.id) {
                    meetup.viewModel.markers()[idx].open = false;
                    meetup.viewModel.markers()[idx].info.close();
                }
            }
            if (marker.open) {
                marker.open = false;
                marker.info.close();
            } else {
                marker.open = true;
                marker.info.open(map, marker);
            }

            // center the map on the marker's position for better viewing
            map.panTo(marker.getPosition());
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