#Neighborhood Map

Live Link/Run the application: <a href="http://wattersnathen.github.io/neighborhood-map/build/" target="_blank">http://wattersnathen.github.io/neighborhood-map/build/</a>

<hr/>

###Project Description:
Find upcoming Meetups in your area. Whatever location you choose, this app will return all the meetups within a ten mile radius.

<hr/>

###How to use:
<ol>
    <li>Enter a location in the search box -OR- drag the map</li>
    <li>Watch the markers show up on screen as the Meetups request is processed</li>
    <li>Click on an event in the list view or on a marker to view event details</li>
</ol>

<hr/>

###Legend:
<figure>
    <img src="https://github.com/wattersnathen/neighborhood-map/blob/master/app/icons/today1.png"/>
    <figcaption>What are you doing here!? The Meetup is going on today!</figcaption>
</figure>
<br/>
<figure>
    <img src="https://github.com/wattersnathen/neighborhood-map/blob/master/app/icons/marker-th.png"/>
    <figcaption>Meetup is occuring this week.</figcaption>
</figure>
<br/>
<figure>
    <img src="https://github.com/wattersnathen/neighborhood-map/blob/master/app/icons/map-pin-red-th.png"/>
    <figcaption>Meetups occuring beyond one week from now.</figcaption>
</figure>

<hr/>

###Resources Used:
<ul>
    <li><a href="https://www.udacity.com/course/intro-to-ajax--ud110" target="_blank">Udacity - Intro to AJAX</a></li>
    <li><a href="https://www.udacity.com/course/javascript-design-patterns--ud989" target="_blank">Udacity - JavaScript Design Patterns</a></li>
    <li>Piazza/Udacity Forums</li>
    <li><a href="https://developers.google.com/maps/documentation/javascript/" target="_blank">Google Maps v3 API</a></li>
    <li><a href="http://knockoutjs.com/documentation/introduction.html">Knockout.js Documentation</a></li>
    <li><a href="http://momentjs.com/docs/" target="_blank">Moment.js Documentation</a> - used for easily working with Date objects</li>
    <li><a href="http://www.codeproject.com/Tips/674478/Customize-Scrollbars-using-CSS" target="_blank">Create a custom scrollbar</a></li>
</ul>

<hr/>

###Current Issues/Missing Features:
<ul>
    <li>Mobile solution is not ideal</li>
    <li>Open InfoWindow disappears on map drag event - hard to keep track of the event</li>
    <li>Map does not adjust to InfoWindow opening - can't read the details without dragging the mouse/map (see previous)</li>
    <li>Filters/Sorting returned Meetups
        <ul>
            <li>Filter by location/radius from center</li>
            <li>Filter by date</li>
            <li>Filter by Meetup category</li>
        </ul>
    </li>
    <li>Show today's and this week's Meetups as different colors in the list view</li>
</ul>