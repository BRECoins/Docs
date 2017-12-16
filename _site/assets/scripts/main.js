$(document).ready(function() {
    $('#toc').toc();

    $("#language").change(function() {
    	location.href = '/'+$(this).val()+(location.pathname.substr(6));
    });
});