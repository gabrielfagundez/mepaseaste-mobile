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
    if (window.device.platform === 'iOS' && parseFloat(window.device.version) === 7.0)
        StatusBar.overlaysWebView(false);
}
document.addEventListener('deviceready', onDeviceReady, false);