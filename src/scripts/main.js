(function($) {

  'use strict';
  
  var start = function() {

    if ($('.nav').length) {
      startNav();
    };

  };

  function startNav() {
    $('.nav-button').click(function(event) {
      $(this).toggleClass('nav-button--opened');
      $('.nav').toggleClass('nav--opened');
    });
  };

  start();

})(jQuery);
