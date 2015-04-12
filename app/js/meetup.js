var meetup = {
    key: '82d672183c733619762e644e64e2c',
    meetups: [],
    getUpcomingMeetups: function(rad, zipCode) {
        var url = 'https://api.meetup.com/2/open_events?sign=true&photo-host=public&status=upcoming&zip=' + zipCode + '&radius=' + rad + '&key=' + meetup.key;
        $.ajax({
            url: url,
            crossDomain: true,
            dataType: 'jsonp',
            success: function(data) {
                meetups = data.results;
                $.each(data.results, function(index, value) {
                    // ignore results if they don't contain certain properties
                    if (!value.hasOwnProperty("venue")) {
                        return;
                    }

                    console.log(value);
                    
                });
            }
        })
    },
};

meetup.getUpcomingMeetups(10, 80537);