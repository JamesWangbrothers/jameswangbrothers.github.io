'use strict'
var map,
    showMapMessage = ko.observable(false);
//loads the google maps API
function initMap() {
    
    // Create a map object and specify the DOM element for display.
    var mapOptions =  {
        center: {lat: 37.3382, lng: -121.8863},
        scrollwheel: false,
        zoom: 11,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: true,
        overviewMapControl: true,
        rotateControl: true,
        scaleControl: true
        //mapTpyeId: google.maps.mapTpyeId.ROADMAP,
        //panControl: false,
        //mapTypeControl: false,
    };

    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, mapOptions);
    
    ko.applyBindings(new viewModel());
}

//error message
function googleError() {
    showMapMessage(true);
}

/***********Model*****/
var locations = [
    {
        name: "SAP Center",
        lat: 37.332202,
        lng: -121.901078
        //address: "525 W Santa Clara St San Jose, CA 95113"

    },
    {
        name: "Mineta San José International Airport",
        lat: 37.362888,
        lng: -121.928930
        //address: "1701 Airport Blvd San Jose, CA 95110"

    },
    {
        name: "California's Great America",
        lat: 37.392724,
        lng: -121.964893
        //address: "4701 Great America Pkwy Santa Clara, CA 95054"

    },
    {
        name: "Westfield Valley Fair Mall",
        lat: 37.323682,
        lng: -121.965667
        //address: "2855 Stevens Creek Blvd Santa Clara, CA 95050"

    },
    {
        name: "Levi's Stadium",
        lat: 37.402035,
        lng: -121.969099
        //address: "4900 Marie P DeBartolo Way Santa Clara, CA 95054"

    }   
];

/***********CONSTRUCTOR*************/
var Place = function(data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.lat = ko.observable(data.lat);
    self.lng = ko.observable(data.lng);
    self.description = ko.observable(data.description);
    self.url = ko.observable('');
    self.marker = ko.observable();
    self.address = ko.observable('');
    self.contentString = ko.observable('');

};

/***********VIEW MODEL*************/
var viewModel = function(){

    var self = this;

    //another way to do filtering search
    //self.places = ko.observableArray(locations);

    // self.filter = ko.observable('');

    // self.search = ko.computed(function(){
    //     return ko.utils.arrayFilter(self.places(), function(point){
    //         return point.name.toLowerCase().indexOf(self.filter().toLowerCase()) >= 0;
    //     });
    // });

    var client_id = '3YUNRB2OBRZFDK3NDXIKNGHQJOPD0JKSZ4P0MBFQVXTA33RN',
        client_secret = '3EN00YN11KGVKLNGT5WFRKCXN5VZ2J4PSEZGJTA4CRUWFJEM',
        infowindow = new google.maps.InfoWindow({maxWidth:200}),
        //image = 'map-marker.png',
        searchInput,
        location,
        marker,
        url,
        venue;

    //array of places
    self.places = ko.observableArray([]);

    //foursqaure error ko
    self.showMessage = ko.observable(false);

    //call the constructor
    locations.forEach(function(placeItem){
        self.places.push(new Place(placeItem));
    });

    //set markers, request foursquare data and set listeners
    self.places().forEach(function(placeItem){

        //define markers
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(placeItem.lat(), placeItem.lng()),
            map: map,
            //icon: image,
            animation: google.maps.Animation.DROP
        });
        placeItem.marker = marker;

        /*******FOURSQUARE**********/
        $.ajax({
            url:'https://api.foursquare.com/v2/venues/search',
            dataType: 'json',
            data: 'limit=1' +
                    '&ll=37.3382,-121.8863' +
                    '&query=' + placeItem.name() +
                    '&client_id='+ client_id +
                    '&client_secret='+ client_secret +
                    '&v=20160419',

            async: true,

            // If data call is successful - check for various properties and assign them to observables
            success: function (data) {
                // If incoming data has a venues object set the first one to the var venue
                venue = data.response.hasOwnProperty("venues") ? data.response.venues[0] : '';

                // If the new venue has a property called location set that to the variable location
                location = venue.hasOwnProperty('location') ? venue.location : '';
                    // If new location has prop address then set the observable address to that or blank
                    if (location.hasOwnProperty('address')) {
                        placeItem.address(location.address || '');
                    }

                url = venue.hasOwnProperty('url') ? venue.url : '';
                    placeItem.url(url || '');

                // Content of the infowindow
                placeItem.contentString = '<div id="iWindow"><h3>' + placeItem.name() + '</h3>'
                        +'<p>' + placeItem.address() + '</p><p><a href=' + placeItem.url() + '>' + placeItem.url() +
                        '</a></p><p><a target="_blank" href=https://www.google.com/maps/dir/Current+Location/' +
                        placeItem.lat() + ',' + placeItem.lng() + '>Directions</a></p></div>';

                // Add infowindows
                    google.maps.event.addListener(placeItem.marker, 'click', function () {
                    infowindow.open(map, this);
                    // Bounce animation
                    placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        placeItem.marker.setAnimation(null);
                    }, 800);
                    infowindow.setContent(placeItem.contentString);
                });
            },

            // Alert the user on error
            error: function (e) {
                infowindow.setContent('<h5>Foursquare data is unavailable.</h5>');
                self.showMessage(true);
        }
        });
        
        //event listener for error
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, this);
            placeItem.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                placeItem.marker.setAnimation(null);
            }, 800);
        });
    });

    // Show the marker when the user clicks the list
    self.showInfo = function (placeItem) {
        google.maps.event.trigger(placeItem.marker, 'click');
        //self.hideSidebar();
    };

    // Array containing markers based on search
    self.visible = ko.observableArray();

    // All markers are visible by default
    self.places().forEach(function (place) {
        self.visible.push(place);
    });

    // Track input
    self.userInput = ko.observable('');
    
    //if input matches leave marker
    self.filterMarkers = function () {
        // Set all markers and places to not visible.
        searchInput = self.userInput().toLowerCase();
        //close current infowindows when search term entered
        infowindow.close();
        self.visible.removeAll();
        
        self.places().forEach(function (place) {
            place.marker.setVisible(false);
                // If user input is included in the name, set marker as visible
                if (place.name().toLowerCase().indexOf(searchInput) !== -1) {
                self.visible.push(place);
            }
        });
        
        self.visible().forEach(function (place) {
            place.marker.setVisible(true);
        });
    };
};
