function Map(){"use strict";var e=this;e.map={},e.center={},e.searchBox=new google.maps.places.SearchBox(document.getElementById("pac-input")),e.geocoder=new google.maps.Geocoder,e.viewModel={googleMap:ko.observable({lat:ko.observable(),lng:ko.observable()}),address:ko.observable(),meetups:meetup.viewModel.meetups,markers:meetup.viewModel.markers,clickMarker:function(o){for(var t=0;t<e.viewModel.meetups().length;t++){var n=e.viewModel.markers()[t];n.open&&(n.open=!1,n.info.close()),n.id==o.id&&(n.open=!0,n.info.open(e.map,n),e.map.panTo(n.getPosition()))}}},e.getCurrentPosition=function(){navigator.geolocation?navigator.geolocation.getCurrentPosition(function(o){e.lat=o.coords.latitude,e.lng=o.coords.longitude,e.viewModel.googleMap().lat(e.lat),e.viewModel.googleMap().lng(e.lng),e.getLocationFromLatLng(e.viewModel.googleMap().lat(),e.viewModel.googleMap().lng())},function(){e.setDefaultPosition()}):e.setDefaultPosition()},e.getLocationFromLatLng=function(o,t){var n=new google.maps.LatLng(o,t);meetup.viewModel.meetups([]);for(var a=0,r=meetup.viewModel.markers().length;r>a;a++)meetup.viewModel.markers()[a].setMap(null);meetup.viewModel.markers([]),n.A&&n.F&&(meetup.getUpcomingMeetups(10,n,e.map),e.viewModel.address(n))},e.setDefaultPosition=function(){e.lat=40.015,e.lng=-105.27,e.viewModel.googleMap().lat(e.lat),e.viewModel.googleMap().lng(e.lng),e.getLocationFromLatLng(e.viewModel.googleMap().lat(),e.viewModel.googleMap().lng())},ko.bindingHandlers.map={init:function(o,t,n,a){var r=ko.utils.unwrapObservable(t()),i=new google.maps.LatLng(ko.utils.unwrapObservable(r.lat),ko.utils.unwrapObservable(r.lng)),l={center:i,zoom:12,zoomControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},panControlOptions:{position:google.maps.ControlPosition.TOP_RIGHT},mapTypeId:google.maps.MapTypeId.ROADMAP};r.googleMap=new google.maps.Map(o,l),e.map=r.googleMap,r.onChangeCoord=function(o){var t=new google.maps.LatLng(ko.utils.unwrapObservable(r.lat),ko.utils.unwrapObservable(r.lng));r.googleMap.setCenter(t),e.center=r.googleMap.getCenter(),e.getLocationFromLatLng(e.center.A,e.center.F)},google.maps.event.addListenerOnce(r.googleMap,"idle",function(){google.maps.event.trigger(r.googleMap,"resize")}),google.maps.event.addListener(r.googleMap,"dragend",function(){e.center=r.googleMap.getCenter(),e.getLocationFromLatLng(e.center.A,e.center.F)}),google.maps.event.addListener(e.searchBox,"places_changed",function(){var o=e.searchBox.getPlaces(),t=o[0].geometry.location.A,n=o[0].geometry.location.F;e.getLocationFromLatLng(t,n),e.viewModel.googleMap().lat(t),e.viewModel.googleMap().lng(n)}),google.maps.event.addDomListener(window,"resize",function(){var o=e.map.getCenter();google.maps.event.trigger(e.map,"resize"),e.map.setCenter(o)}),r.lat.subscribe(r.onChangeCoord),r.lng.subscribe(r.onChangeCoord)}}}var today=moment(Date.now()),meetup={key:"82d672183c733619762e644e64e2c",viewModel:{meetups:ko.observableArray([]),markers:ko.observableArray([])},getUpcomingMeetups:function(e,o,t){var n="https://api.meetup.com/2/open_events?sign=true&photo-host=public&status=upcoming&lat="+o.A+"&lon="+o.F+"&radius="+e+"&key="+meetup.key;$.ajax({url:n,crossDomain:!0,dataType:"jsonp",success:function(e){$.each(e.results,function(e,o){o.hasOwnProperty("venue")&&(meetup.viewModel.meetups.push(o),meetup.viewModel.markers.push(meetup.createMarker(o,t)))})},error:function(e){$("#results").text("Failed retrieving results from the Meetup API")}})},createMarker:function(e,o){var t,n=new google.maps.LatLng(e.venue.lat,e.venue.lon),a=moment(e.time).toDate(),r=moment(a).isSame(today,"day");t=r?"icons/today1.png":moment(a).subtract(7,"days")<=moment(today)?"icons/marker-th.png":"icons/map-pin-red-th.png",a=moment(a).format("MMMM Do YYYY, h:mm a");var i=new google.maps.Marker({position:n,map:o,icon:t});r&&i.setAnimation(google.maps.Animation.BOUNCE);var l='<div class="infowindow"><a href="'+e.event_url+'" target="_blank" class="eventurl"><h1>'+e.name+"</h1></a><p><strong>"+a+'</strong>,&nbsp;<a href="http://www.meetup.com/'+e.group.urlname+'" target="_blank">'+e.group.name+"</a></p><p>"+e.venue.address_1+"&nbsp;"+e.venue.city+", "+e.venue.state+"</p><p>"+e.description+"</p></div>";return i.info=new google.maps.InfoWindow({content:l}),i.id=e.id,i.date=a,i.open=!1,google.maps.event.addListener(i.info,"closeclick",function(){i.open=!1}),google.maps.event.addListener(i,"click",function(){for(var e=0;e<meetup.viewModel.markers().length;e++)meetup.viewModel.markers()[e].id!=i.id&&(meetup.viewModel.markers()[e].open=!1,meetup.viewModel.markers()[e].info.close());i.open?(i.open=!1,i.info.close()):(i.open=!0,i.info.open(o,i)),o.panTo(i.getPosition())}),i}};ko.bindingHandlers.dateString={init:function(e,o,t,n,a){var r=ko.unwrap(o());r=moment(r).toDate(),$(e).text(moment(r).format("MMMM Do YYYY, h:mm a"))}},function(e){"use strict";var o=new Map;e(document).ready(function(){e(document).ajaxStart(function(){e(".results").text(""),e(".loading").show()}),e(document).ajaxStop(function(){e(".loading").hide(),void 0===o.viewModel.meetups()[0]&&e(".results").text("It appears that there are no upcoming Meetups in the chosen area. Please search for a new location or try again later.")}),ko.applyBindings(o.viewModel),o.setDefaultPosition(),e("#toggle-menu").on("click",function(o){e(".container").toggle()})})}(jQuery);