(function ($) {
  "use strict";
  $(function () {
    $("a[data-image]")
      .each(function() {
        var self = $(this);
        self.attr('href', self.attr('data-image'));
      })
      .nivoLightbox();
    $(".slider").slick({
      arrows: false,
      autoplay: true
    });
  });
})(jQuery);
