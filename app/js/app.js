(function() {
    'use strict';

    $(document).ready(function() {
        var map = new Map();
        map.getCurrentPosition();
        ko.applyBindings(map.viewModel);
    });


})();