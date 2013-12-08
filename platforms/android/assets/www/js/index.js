var estado = 'Abierto'

$(document).ready(function() {
    initialize(true);
    set_map_height()

    $("#toggle").click(function(){
        $("#footer_content").slideToggle("fast");
        if(estado == 'Abierto'){
            $('#ver_puntos').html('Ocultar');
            estado = 'Cerrado';
        } else {
            $('#ver_puntos').html('Ver puntos ingresados')
            estado = 'Abierto';
        }
    });
});

function set_map_height(){
    $('#map').css('height', $(document).height() - 50)
}