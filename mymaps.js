var geocoder;
var map;
// initialisation de la carte Google Map de départ
function initialiserCarte() {
  geocoder = new google.maps.Geocoder();
  // Ici j'ai mis la latitude et longitude du vieux Port de Marseille pour centrer la carte de départ
  var latlng = new google.maps.LatLng(43.295309,5.374457);
  var mapOptions = {
    zoom      : 17,
    center    : latlng,
    mapTypeId : google.maps.MapTypeId.TERRAIN
  }
  // map-canvas est le conteneur HTML de la carte Google Map
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    google.maps.event.addDomListener(window, 'load', initialiserCarte);
  /*var optionsPanoramiqueStreetView = {
          position: centreCarte,
          pov: {
            heading: 34,
            pitch: 10,
            zoom: 1
          }
        };
*/
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('input'));
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('origin'));
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('destination'));
  var autocomplete = new google.maps.places.Autocomplete(document.getElementById('adresse'));
//autocomplete.bindTo('bounds', map);
/*
var infowindow = new google.maps.InfoWindow();
var marker = new google.maps.Marker({
  map: map
});
*/
google.maps.event.addListener(autocomplete, 'place_changed', function() {
  var place = autocomplete.getPlace();
  if (!place.geometry) {
// Inform the user that the place was not found and return.
input.className = 'notfound';
return;
}

/* If the place has a geometry, then present it on a map. */
if (place.geometry.viewport) {
  map.fitBounds(place.geometry.viewport);
} else {
  map.setCenter(place.geometry.location);
map.setZoom(17); // Why 17? Because it looks good.
}
var image = new google.maps.MarkerImage(
  place.icon,
  new google.maps.Size(71, 71),
  new google.maps.Point(0, 0),
  new google.maps.Point(17, 34),
  new google.maps.Size(35, 35));
marker.setIcon(image);
marker.setPosition(place.geometry.location);
});

direction = new google.maps.DirectionsRenderer({
  map   : map,
  panel : panel
});



}

if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = new google.maps.LatLng(position.coords.latitude,
     position.coords.longitude);

    var markergeo = new google.maps.Marker({
      position: pos,
      map: map,
      title:"Vous êtes ici !",

    });

    map.setCenter(pos);
  }, function() {
    handleNoGeolocation(true);
  });
} else {
    // Browser doesn't support Geo
    location
    handleNoGeolocation(false);
  }


  calculate = function(){
    origin      = document.getElementById('origin').value; // Le point départ
    destination = document.getElementById('destination').value; // Le point d'arrivé
    if(origin && destination){
      
      var selectedMode = document.getElementById('mode').value;
      var request = {
        origin      : origin,
        destination : destination,
            travelMode: google.maps.TravelMode[selectedMode]
 // Type de transport
          }
        var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
        directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
          if(status == google.maps.DirectionsStatus.OK){
                direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
              }
            });
    } //http://code.google.com/intl/fr-FR/apis/maps/documentation/javascript/reference.html#DirectionsRequest
  };

  function TrouverAdresse() {
  // Récupération de l'adresse tapée dans le formulaire
  var adresse = document.getElementById('adresse').value;
  geocoder.geocode( { 'address': adresse}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      // Récupération des coordonnées GPS du lieu tapé dans le formulaire
      var strposition = results[0].geometry.location+"";
      strposition=strposition.replace('(', '');
        strposition=strposition.replace(')', '');
      // Affichage des coordonnées dans le <span>
      document.getElementById('text_latlng').innerHTML='Coordonnées : '+strposition;
      // Création du marqueur du lieu (épingle)
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    } else {
      alert('Adresse introuvable: ' + status);
    }
  });
  google.maps.event.addDomListener(window, 'load', initialiserCarte);
}



function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }


}

function requestFullScreen() {

  var el = document.getElementById("map-canvas");

  // Supporte la plupart des navigateur et leur versions.
  var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen 
  || el.mozRequestFullScreen || el.msRequestFullScreen;

  if (requestMethod) {

    // Native full screen.
    requestMethod.call(el);

  } else if (typeof window.ActiveXObject !== "undefined") {

    // Older IE.
    var wscript = new ActiveXObject("WScript.Shell");

    if (wscript !== null) {
      wscript.SendKeys("{F11}");
    }
  }

}
/*
function addMarker(map, body, location) {
    var marker = new google.maps.Marker({
        map : map, 
        position : location,
        animation: google.maps.Animation.DROP,
        draggable : true
    });
    marker.setTitle("Mon marqueur");
    var infowindow = new google.maps.InfoWindow( {
        content : body
    });
    new google.maps.event.addListener(marker, "click", function() {
        infowindow.open(map, marker);
    });
    new google.maps.event.addListener(marker, "rightclick", function() {
        removeMarker(marker);
    });
    new google.maps.event.addListener(marker, 'dragend', function(){
        searchMarkerCoords(marker, infowindow);
    });
}
*/


google.maps.event.addDomListener(window, 'load', initialiserCarte);
