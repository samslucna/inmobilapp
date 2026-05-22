
  (function($){
  $(document).ready(function(){
    $('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
      event.preventDefault(); 
      event.stopPropagation(); 
      $(this).parent().siblings().removeClass('open');
      $(this).parent().toggleClass('open');
    });
  });

  // Mouse hover
  $("#dropdown").hover(            
        function() {
            $('#dropdown-menu', this).not('.in #dropdown-menu').stop(true,true).slideDown("400");
            $(this).toggleClass('open');        
        },
        function() {
            $('#dropdown-menu', this).not('.in #dropdown-menu').stop(true,true).slideUp("400");
            $(this).toggleClass('open');       
        }
    );
})(jQuery);