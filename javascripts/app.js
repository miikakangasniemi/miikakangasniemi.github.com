(function ($) {
  "use strict";
  $(function () {
    var images = $(".boxes--images");
    if (images.length > 0) {
      lightGallery(
        images[0],
        {
          download: false,
          selector: '.box:not(.box--title)'
        }
      );
    }
    $(".slider").slick({
      arrows: false,
      autoplay: true
    });

    (function () {
      var
        // This is used for min scroll top limit. The value is in px.
        headerAutoHideMinScrollTop = 300,
        $window = $(window),
        $mainNav = $('.main-nav'),
        $wrapper = $('<div class="sticky-wrapper">'),
        stickyListener = function () {
          if ($window.scrollTop() > 1) {
            if (!$mainNav.hasClass('stuck')) {
              $wrapper.css('height', $mainNav.outerHeight(true));
            }
            $mainNav.addClass('stuck');
          } else {
            $mainNav.removeClass('stuck');
            $wrapper.css('height', '');
          }
        },
        stickyListenerThrottled = _.throttle(stickyListener, 200),
        headerHideListener = function(direction) {
          if (direction === window.scrollDirection.directions.down && $window.scrollTop() > headerAutoHideMinScrollTop) {
            $mainNav.addClass('hidden');
          } else if (direction === window.scrollDirection.directions.up) {
            $mainNav.removeClass('hidden');
          }
        };
      $wrapper = $mainNav.wrap($wrapper).parent();
      stickyListener();
      $window.resize(stickyListenerThrottled).scroll(stickyListenerThrottled);
      window.scrollDirection.addMethod(headerHideListener);
    })();
  });
})(jQuery);
