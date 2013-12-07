$(document).ready(function() {
    initialize(true);
    set_map_height()

    $("#toggle").click(function(){
        $("#panel").slideToggle("fast");
    });
});

function set_map_height(){
    $('#map').css('height', $(document).height())
}