'use strict'
var locations = [
{
    name: "Sushi Bar",
    // position: {lat: , lng: },
    description: ""

},
{
    name: "Korea BBQ",
    //position: {lat: , lng: },
    description: ""

},
{
    name: "KTV",
    //position: {lat: , lng: },
    description: ""

},
{
    name: "Hiking",
    //position: {lat: , lng: },
    description: ""

},
{
    name: "Mall",
    //position: {lat: , lng: },
    description: ""

},   
];

var viewModel = function(){

    var self = this;

    self.places = ko.observableArray(locations);

    self.filter = ko.observable('');

    self.search = ko.computed(function(){
    return ko.utils.arrayFilter(self.places(), function(point){
      return point.name.toLowerCase().indexOf(self.filter().toLowerCase()) >= 0;
    });
  });
};
ko.applyBindings(new viewModel());

//loads the google maps API
function initMap() {
  var myLatLng = {lat: 37.3382, lng: -121.8863};

  // Create a map object and specify the DOM element for display.
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: myLatLng,
    scrollwheel: false,
    zoom: 15
  });

  // Create a marker and set its position.
  var marker = new google.maps.Marker({
    map: map,
    position: myLatLng,
    title: 'Hello World!'
  });


}