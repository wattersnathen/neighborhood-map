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
                });
            }
        })
    },

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

};

// custom binding for handling the date format of the events returned.
ko.bindingHandlers.dateString = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        value = moment(value).toDate();
        $(element).text(moment(value).format('MMMM Do YYYY, h:mm a'));
    }
};