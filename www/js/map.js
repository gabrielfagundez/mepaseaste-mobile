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

function createMarker(event) {

    if(markerId == 1) {
        icon = 'img/icon/start_marker.png';
    } else {
        icon = 'img/icon/end_marker.png';
    }

    if(markerId == 1) {
        nombre = 'Desde dónde partimos?';
    } else {
        nombre = 'De quién es este hogar?';
    }

    if(markerId == 1) {
        start = true;
    } else {
        start = false;
    }

    marker = new google.maps.Marker({
        draggable: false,
        position: event.latLng,
        map: map,

        // App Variables
        markerId: markerId,
        nombre: nombre,
        icon: icon,
        start: start,

        address: '',

        // Esta sección se usa para la parte estándar
        distancias_anteriores_raw: new Array(),
        distancias_anteriores_string: new Array(),

        tiempos_anteriores_raw: new Array(),
        tiempos_anteriores_string: new Array(),
    });

    google.maps.event.addListener(marker, 'click', function() {
        showBubble(event.latLng, marker['markerId']);
        map.panTo(event.latLng);
    });


    // Calculamos la distancia desde el punto a los demas marcadores o el costo en caso de la sección internacional
    addNewPoint(marker, markers.length);

    // Update marker ID
    markerId = markerId + 1;
    markers.push(marker);


    // Update table
    tabla = $('#tabla_de_datos');
    html =
        "<tr id='fila_" + marker.markerId + "'>" +
            "<a href='javascript:centerMarker(" + marker.markerId + ");'>" +
            "<th>" +
            "<img src='" + marker.icon + "'>" +
            "</th>" +
            "</a>" +
            "<th id='geocode_" + marker.markerId + "'><p>Obteniendo dirección.. </p></th>" +
            "</tr>";
    tabla.append(html);


    // Delete Info Box
    $('#con-datos').show();
    $('#sin-datos').hide();

    if(markers.length > 1){
        $('#boton_enviar_datos').show();
    }


    // Geocode the direction
    geocoder.geocode({'latLng': event.latLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                $('#geocode_' + marker.markerId).html("<p>" + results[0].formatted_address + "</p>");
                getMarkerByID(marker.markerId).address = results[0].formatted_address;
            }
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });

    return marker;
}


function getMarkerByID(id) {
    for(var i=0; i < markers.length; i++) {
        var marker = markers[i];
        if(marker && marker.markerId == id) {
            return marker;
        }
    }
}

function addMarkerToResultPage(latitude, longitude, icon){
    position = new google.maps.LatLng(latitude, longitude)

    marker = new google.maps.Marker({
        draggable: false,
        position: position,
        map: map,
        icon: icon,
    });

    google.maps.event.addListener(marker, 'click', function() {
        showBubble(event.latLng, marker['markerId']);
        map.panTo(event.latLng);
    });
};


function addNewPoint(marker, cant_markers) {

    if(cant_markers != 0){

        // Variables de consulta
        origin = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
        destinations = new Array()

        for(var actual_pos = 0; actual_pos < cant_markers; actual_pos++) {
            destinations.push(new google.maps.LatLng(markers[actual_pos].position.lat(), markers[actual_pos].position.lng()));
        }

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: destinations,
                travelMode: google.maps.TravelMode.DRIVING,
                avoidHighways: false,
                avoidTolls: false
            },
            function(response, status) { processDistances(response, status, marker) }
        );
    }
}


// Importante:
// Cada marcador posee información relativa a todos los anteriores marcadores
// ingresados en el sistema. De esta forma, se alivia la carga a Google una vez que
// se envía la información final.
function processDistances(response, status, marker){

    if (status == google.maps.DistanceMatrixStatus.OK) {

        // Obtenemos el origen
        var origins = response.originAddresses;

        // Obtenemos los destinos
        var destinations = response.destinationAddresses;

        // Obtenemos la matriz de distancias
        var distancias = response.rows[0]['elements'];

        // Almacenamos las distancias de cada uno
        for(var iter_res = 0; iter_res < distancias.length; iter_res++){

            // Verificamos que no haya error en la distancia puntual
            if(distancias[iter_res]['status'] == google.maps.DistanceMatrixStatus.OK) {

                // Obtenemos los datos puntuales
                distancia = distancias[iter_res]['distance'];
                tiempo = distancias[iter_res]['duration'];

                // Actualizamos el marker con los datos de Google
                marker.distancias_anteriores_string.push(distancia['text']);
                marker.distancias_anteriores_raw.push(distancia['value']);
                marker.tiempos_anteriores_string.push(tiempo['text']);
                marker.tiempos_anteriores_raw.push(tiempo['value']);

            } else {
                alert('Ocurrió un error en la funcion de obtener distacia - La llamada a Google dio error en un punto específico');
            }
        }
    } else {
        alert('Ocurrió un error en la funcion de obtener distancia - La llamada a Google dio Success pero devolvio error interno');
    }

}
