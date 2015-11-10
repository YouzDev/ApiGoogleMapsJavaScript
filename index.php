<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="renew.css">
  <style type="text/css">
  html, body, #map-canvas { height: 600px; width:800px; margin: auto; margin-top: 50px; padding: 0;}
  </style>
  <script type="text/javascript"
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBqwIhfnwI2ymN8x6z__w0Qw5Hj-WZ66u0&amp;libraries=places&amp;language=fr">
  </script>
  <title> My Maps </title>
</head>
<body onload="initialiserCarte()">
  <div id="header"> 

    <h1> Find your way my friend </h1>

    <div id="map-canvas"></div>

    
    
    

    <form name="direction" id="direction">
      
     <input type="text" name="origin" id="origin" placeholder="Point de départ">
     <input type="text" name="destination" id="destination" placeholder="Point d'arrivée">
     <input type="button" value="Calculer l'itinéraire" onclick="calculate()">

     <select id="mode" onchange="calculate()">
      <option value="DRIVING">Voiture</option>
      <option value="WALKING">A Pied</option>
      <option value="BICYCLING">Vélo</option>
      <option value="TRANSIT">Transport en commun (Grosse villes uniquement)</option>
    </select>

  <input type="button" name="fullscreen" value="Fullscreen" onclick="requestFullScreen()">
    <input type="text" id="adresse" name="adresse"/>
    <input type="button" value="Localiser sur Google Map" onclick="TrouverAdresse()"/>
  <input type="button" OnClick="javascript:window.location.reload()" value="Actualiser">
  </form>
  <button id="affiche" onclick="affiche();">Affiche ton trajet </button>

  <form>
    <div class="actions">


      <div class="button">
        <label for="gmap_type">Type:</label>
        <select id="gmap_type">
         <option value="art_gallery">Galerie d'art</option>
         <option value="atm">Distributeur de billet</option>
         <option value="bank">Banque</option>
         <option value="bar">Bar</option>
         <option value="cafe">Café</option>
         <option value="food">Restaurant</option>
         <option value="hospital">Hopital</option>
         <option value="police">Police</option>
         <option value="store">Magasin</option>
       </select>
     </div>
     <div class="button">
      <label for="gmap_radius">Rayon :</label>
      <select id="gmap_radius">
        <option value="500">500m</option>
        <option value="1000">1000m</option>
        <option value="1500">1500m</option>
        <option value="5000">5000m</option>
      </select>
    </div>

    <input type="hidden" id="lat" name="lat" value="40.7143528" />
    <input type="hidden" id="lng" name="lng" value="-74.0059731" />

    <div id="button1" class="button" onclick="findPlaces(); return false;">Rechercher</div>
  </div>          
</form>
<span id="text_latlng"></span>
</div>

<div id="panel"></div>
<div id="afficheTrajet" ></div>
<input id='input' name="input" class="input" type="hidden" >

<script type="text/javascript" src="lomaps.js"></script>



</body>
</html>
