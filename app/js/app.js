(function() {
    'use strict';

    $(document).ready(function() {

        // Show loading gif during AJAX requests
        $(document).ajaxStart(function() {
            $(".results").text('');
            $(".loading").show();
        });

        $(document).ajaxStop(function() {
            $(".loading").hide();
            // display a message to the user if no meetups for the area were found
            if (map.viewModel.meetups()[0] === undefined) {
                $(".results").text('It appears that there are no upcoming Meetups in the chosen area. Please search for a new location or try again later.');
            }
        });

        var map = new Map();
        map.getCurrentPosition();
        ko.applyBindings(map.viewModel);
    });

})();