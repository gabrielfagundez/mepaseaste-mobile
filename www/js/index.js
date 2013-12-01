document.addEventListener("orientationchange", updateLayout);

// The wrapperWidth before orientationChange. Used to identify the current page number in updateLayout();
wrapperWidth = 0;

var myScroll = new iScroll('pageWrapper', {
    snap: true,
    momentum: false,
    hScrollbar: false,
    vScrollbar: false,
    lockDirection: true,
    onScrollEnd: function() {
        var currentPage = - Math.ceil( $('#pageScroller').position().left / wrapperWidth);

        for(var i = 0; i < 4; i++){
            $('#header' + i).removeClass('active');
        }

        $('#header' + currentPage).addClass('active');
    }
});

updateLayout();

function updateLayout() {

    var currentPage = 0;

    if (wrapperWidth > 0) {
        currentPage = - Math.ceil( $('#pageScroller').position().left / wrapperWidth);
    }

    wrapperWidth = $('#pageWrapper').width();

    $('#pageScroller').css('width', wrapperWidth * 4);
    $('.page').css('width', wrapperWidth);
    myScroll.refresh();
    myScroll.scrollToPage(currentPage, 0, 0);
}
