/*global google, city*/
/*jslint browser:true node:true */

var geocoder;
var map;
var markers = Array();
var infos = Array();
// initialisation de la carte Google Map 
function initialiserCarte() {

  geocoder = new google.maps.Geocoder();
  // Ici j'ai mis la latitude et longitude du Chateau d'Edo a Tokyo au Japon pour centrer la carte de départ
  var latlng = new google.maps.LatLng(35.690075, 139.755707);
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
        // l'autocomplete pour tout les champs 
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
// Informe l'utilisateur que la place n'a pas été trouvé
input.className = 'notfound';
return;
}

if (place.geometry.viewport) {
  map.fitBounds(place.geometry.viewport);
} else {
  map.setCenter(place.geometry.location);
map.setZoom(17); 
}
var image = new google.maps.MarkerImage(
  place.icon,
  new google.maps.Size(71, 71),
  new google.maps.Point(0, 0),
  new google.maps.Point(17, 34),
  new google.maps.Size(35, 35));
markers.setIcon(image);
markers.setPosition(place.geometry.location);
});

direction = new google.maps.DirectionsRenderer({
  map   : map,
  panel : panel
});



}
function clearOverlays() {
  if (markers) {
        for (i in markers) {
            markers[i].setMap(null);
            }
            markers = [];
            infos = [];
            }
  }

  // clear infos function
  function clearInfos() {
    if (infos) {
      for (i in infos) {
        if (infos[i].getMap()) {
          infos[i].close();
        }
      }
    }
  }
/* La géolocalisation qui va ajouter le marker a l'emplacement ou on se trouve */

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

/* La fonction qui va calculer le point de départ jusqu'a celui d'arrivé, celle qui va faire l'itinéraire */
  function calculate(){

    origin      = document.getElementById('origin').value; // Le point départ
    destination = document.getElementById('destination').value; // Le point d'arrivé
    if(origin && destination){

      var selectedMode = document.getElementById('mode').value;
      var request = {
        origin      : origin,
        destination : destination,
        travelMode: google.maps.TravelMode[selectedMode] // Type de transport
      }
        var directionsService = new google.maps.DirectionsService(); // Service de calcul d'itinéraire
        directionsService.route(request, function(response, status){ // Envoie de la requête pour calculer le parcours
          if(status == google.maps.DirectionsStatus.OK){
            direction.setDirections(response); // Trace l'itinéraire sur la carte et les différentes étapes du parcours
            console.log(response);

            var array = [];
            for (var i = 0; i <= response.routes[0].legs[0].steps.length - 1; i++) {

              array.push(response.routes[0].legs[0].steps[i].instructions);

            }
            //console.log(array);
            localStorage['array'] = array;

            localStorage['array']

            if (localStorage) {
              localStorage['array'] = document.getElementById("afficheTrajet");
              localStorage.setItem('array', array);
              console.log(localStorage.getItem('array'));




            } else {
                // localStorage non supporté
              }

            }

          });
      } 
    };
/* La fonction qui va afficher le dernier trajet rentré */
    function affiche() {


      document.addEventListener("click", function(){
       document.getElementById('afficheTrajet').innerHTML = localStorage['array'];
     });
   }
/* La fonction qui va Chercher et trouver une adresse, ville, un pays */
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

      document.getElementById('lat').value = results[0].geometry.location.lat();
      document.getElementById('lng').value = results[0].geometry.location.lng();
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

  function createMarkers(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {

        // if we have found something - clear map (overlays)
        clearOverlays();

        // and create new markers by search result
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
        }
      } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
       alert('Sorry, nothing is found');
     }
   }

function findPlaces() {

    // prepare variables (filter)
    var type = document.getElementById('gmap_type').value; 
    var radius = document.getElementById('gmap_radius').value;

    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var cur_location = new google.maps.LatLng(lat, lng);

    // prepare request to Places
    var request = {
      location: cur_location,
      radius: radius,
      types: [type]
    };


    // send request
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
  }


   function createMarker(obj) {

      // prepare une new Marker object
      var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        title: obj.name
      });
      markers.push(mark);

      // prepare info window
      var infowindow = new google.maps.InfoWindow({
       content: '<img src="' + obj.icon + '" /><font style="color:#000;">' + obj.name +
       '<br />Rating: ' + obj.rating + '<br />Vicinity: ' + obj.vicinity + '</font>'
     });
    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function() {
      clearInfos();
      infowindow.open(map,mark);
    });
    infos.push(infowindow);
  }

/* Fonction qui va mettre en fullscreen */
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


google.maps.event.addDomListener(window, 'load', initialiserCarte);
