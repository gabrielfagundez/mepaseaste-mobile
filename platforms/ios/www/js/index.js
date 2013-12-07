function initialize_headers(){
    $('#selected0').css('width', $('#header0').width());
}

$(document).ready(function() {
    initialize_headers();
    initialize(true);
});

$$('#barra_inferior').swipeUp(function(){
    alert('scroll para arriba')
});


function onDeviceReady() {
    StatusBar.overlaysWebView(false);
}
document.addEventListener('deviceready', onDeviceReady, false);