'use strict'
var map,
    showMapMessage = ko.observable(false);
//loads the google maps API
function initMap() {
    
    // Create a map object and specify the DOM element for display.
    var mapOptions =  {
        center: {lat: 37.368830, lng: -122.03635},
        scrollwheel: false,
        zoom: 11,
        zoomControl: true,
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
        //scaleControl: true
        //streetViewControl: true,
        //overviewMapControl: true,
        //rotateControl: true,
        //disableDefaultUI: true,
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

/***********MODEL*************/
var locations = [
    {
        name: "SAP Center",
        lat: 37.332202,
        lng: -121.901078

    },
    {
        name: "Stanford Univeristy",
        lat: 37.426441,
        lng: -122.170973

    },
    {
        name: "Mineta San José International Airport",
        lat: 37.362888,
        lng: -121.928930

    },
    {
        name: "San Jose State Univeristy",
        lat: 37.334659,
        lng: -121.880822

    },
    {
        name: "California's Great America",
        lat: 37.392724,
        lng: -121.964893

    },
    {
        name: "Westfield Valley Fair Mall",
        lat: 37.323682,
        lng: -121.965667

    },
    {
        name: "Levi's Stadium",
        lat: 37.402035,
        lng: -121.969099

    },
    {
        name: "De Anza College",
        lat: 37.318669,
        lng: -122.046003

    },
    {
        name: "Computer History Museum",
        lat: 37.413713,
        lng: -122.077203

    },
    {
        name: "Googleplex",
        lat: 37.421732,
        lng: -122.083876

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
        image = 'Images/mapicon.png',
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
            icon: image,
            animation: google.maps.Animation.DROP
        });
        placeItem.marker = marker;

        /***********FOURSQUARE*************/
        $.ajax({
            url:'https://api.foursquare.com/v2/venues/search',
            dataType: 'json',
            data: 'limit=1' +
                    '&ll=37.370626,-122.012272' +
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
                placeItem.contentString = '<div id="iWindow"><h5>' + placeItem.name() + '</h5>'
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

        //add event listener for responsive map
        google.maps.event.addDomListener(window, 'resize', function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center); 
        });
        
        //add event listener for error
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
    };

    // Array containing markers based on search
    self.visible = ko.observableArray();

    // All markers are visible by default
    self.places().forEach(function (place) {
        self.visible.push(place);
    });
    
    //build the filter function to display search result, if input matches leave marker

    // Track input
    self.userInput = ko.observable('');

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
