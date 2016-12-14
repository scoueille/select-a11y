// menu-simple
$(document).ready(function(){
    $('#toggle-menu').click(function(e) {
        e.preventDefault();
        $('.nav-main-list').toggleClass('is-open');
        $(this).toggleClass('is-open');
    });
});
