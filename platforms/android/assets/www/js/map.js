// Global variables
var map;
var zoom = 14;
var markerId = 1;
var taxis = new Array();

// This will handle every point on the map
var markers = new Array();
var distancias;
var tiempos;

// Variables para dibujar rutas
var directionsDisplays = new Array();
var directionsService;
var stepDisplay;
var markerArray = [];
var iter = 0;

// Variables para reverse geocoder
var geocoder;

// Esta variable hace referencia a la API KEY para usar la API de taxis internacional
var apikey = 'd6apr3UDROuv';


function initialize(allow_markers) {

    // Servicio de Direcciones
    directionsService = new google.maps.DirectionsService();

    // Geocoder
    geocoder = new google.maps.Geocoder();

    // Opciones del mapa
    var mapOptions = {
        zoom: zoom,
        center: new google.maps.LatLng(-34.9183119, -56.1617842),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Mapa
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Permitir marcadores
    if(allow_markers){
        google.maps.event.addListener(map, 'click', function(event, i) {
            createMarker(event);
        })
    };

    // Map routes renderer
    var rendererOptions = {
        map: map,
        suppressMarkers: true
    }
    for(var ii=0; ii<4; ii++){
        var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        directionsDisplays.push(directionsDisplay);
    }

    // Información del próximo paso
    stepDisplay = new google.maps.InfoWindow();

}

function agregarNombre(){

    // En caso que el ultimo marcador sea un destino
    $('#outPopUp').hide();
    $('#inPopUp').hide();

    // En caso que el ultimo marcador sea origen
    $('#outPopUp_origen').hide();
    $('#inPopUp_origen').hide();

    // Obtenemos el marcador a modificar
    marker = getMarkerByID(markerId - 1);

    // Obtenemos el nombre del marcador
    if(markerId > 2){
        marker.nombre = $('#nombre_marcador').val();
    } else {
        marker.nombre = $('#nombre_marcador_origen').val();
    }

    if(marker.nombre == ''){
        if(marker.markerId == 1){
            marker.nombre = 'Origen';
        } else {
            marker.nombre = 'Destino #' + (marker.markerId - 1);
        }
        $('#nombre_' + marker.markerId).html("<p>" + marker.nombre + "</p>");
    } else {
        $('#nombre_' + marker.markerId).html("<p>" + marker.nombre + "</p>");
    };

    $('#nombre_marcador').val('');
    $('#nombre_marcador_origen').val('');
}