$(document).ready(function() {
    $('#toc').toc();
    var menuelement = $("a[href=\""+window.location.pathname.split("?")[0]+"\"]");
    if(menuelement.length) {
    	menuelement.parent("li").addClass("is-active");
    }
});