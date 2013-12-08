function sendData() {

    var obj = new Object();

    obj.tipo_tarifa = 'diurna';
    obj.marcadores = new Array();

    obj.data_marcadores = new Array();
    for(var i = 0; i < markers.length; i++){
        var marcador_temporal = new Object();

        marcador_temporal.location_query_pos    = markers[i].markerId;
        marcador_temporal.latitude              = markers[i].position.lat();
        marcador_temporal.longitude             = markers[i].position.lng();
        marcador_temporal.address               = markers[i].address;
        marcador_temporal.icon                  = markers[i].icon

        obj.data_marcadores.push(marcador_temporal);
    }

    for(var i = 0; i < markers.length; i++){
        obj.marcadores.push(markers[i].distancias_anteriores_raw);
    }

    var json = JSON.stringify(obj);

    $.ajax({
        contentType: 'application/json',
        data: json,
        type: 'POST',
        url: 'http://localhost:4000/api/mobile/handle_request',
        success: function(data){
            console.log(data);
        }
    });

}