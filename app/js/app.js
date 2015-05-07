(function() {
    'use strict';

    $(document).ready(function() {

        $(document).ajaxStart(function() {
            $("#loading").show();
        });

        $(document).ajaxStop(function() {
            $("#loading").hide();
        });

        var map = new Map();
        map.getCurrentPosition();
        ko.applyBindings(map.viewModel);
    });

})(); 