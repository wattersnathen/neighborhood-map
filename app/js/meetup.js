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
};
meetup.getUpcomingMeetups(10, 80537);
// custom binding for handling the date format of the events returned.
ko.bindingHandlers.dateString = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        value = moment(value).toDate();
        $(element).text(moment(value).format('MMMM Do YYYY, h:mm a'));
    }
};