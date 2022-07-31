function msg(){
    $('.overlay').fadeIn();
            document.onkeydown = function(evt) {
                if (evt.keyCode == 27) {
                    $('.overlay').fadeOut();
                } else if(evt.keyCode == 13){
                    $("form[method='POST']").submit();
                }
            };
}
function back(){
    var msgelem=document.querySelector('.overlay');
    msgelem.style.display='none';
}