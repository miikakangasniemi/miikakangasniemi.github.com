;
(function ($) {
  "use strict";

  var FullWidth = function (element, options) {
    this.$element = $(element);
    this.options = options;
    this.originalSize = {
      width: null,
      height: null
    };
    this.originalAspectRatio = null;
    this.currentAspectRatio = null;
    this.currentParentOffset = null;
    this.$parent = this.$element.parent();
    this.init();
  };

  FullWidth.instances = [];

  FullWidth.prototype = {
    init: function () {
      this.originalSize.width = this.$element.outerWidth();
      this.originalSize.height = this.$element.outerHeight();
      this.originalAspectRatio = this.originalSize.width / this.originalSize.height;
      this.currentAspectRatio = this.originalAspectRatio;
      FullWidth.instances.push(this);
      FullWidth.updateWindowSize();
      this.update();
      this.$element.addClass('full-width--initialized');
    },
    update: function () {
      this.reader();
      this.resetWriter();
      this.resetReader();
      this.writer();
    },
    reader: function () {
      this.currentParentOffset = this.$parent.offset();
    },
    resetWriter: function () {
      if (this.shouldRecalculateHeightFromPaddingBottom()) {
        this.$element.css({
          height: '',
          paddingBottom: '',
          display: 'none'
        });
      }
    },
    resetReader: function () {
      if (this.shouldRecalculateHeightFromPaddingBottom()) {
        var aspectRatioPercentageString = this.$element.css('padding-bottom'),
            aspectRatio = parseFloat(aspectRatioPercentageString) / 100;
        this.currentAspectRatio = 1 / aspectRatio;
      }
    },
    writer: function () {
      var styles = {};

      if (this.shouldRecalculateHeightFromPaddingBottom()) {
        styles.display = '';
      }

      styles.height = -1;
      styles.width = FullWidth.windowSize.width + 'px';
      styles.marginLeft = -this.currentParentOffset.left + 'px';

      if (this.options.preserveAspectRatio) {
        styles.height = (FullWidth.windowSize.width / this.originalAspectRatio);
        styles.paddingBottom = 0;
      } else {
        styles.height = -1;
        styles.paddingBottom = '';
      }

      if (this.shouldRecalculateHeightFromPaddingBottom()) {
        styles.height = (FullWidth.windowSize.width / this.currentAspectRatio);
        styles.paddingBottom = 0;
      }

      if (this.options.minVerticalWhitespaceToViewport && styles.height > (FullWidth.windowSize.height - this.options.minVerticalWhitespaceToViewport)) {
        styles.height = (FullWidth.windowSize.height - this.options.minVerticalWhitespaceToViewport);
      }
      if (this.options.minHeight && styles.height < this.options.minHeight) {
        styles.height = this.options.minHeight;
      }
      if (this.options.maxHeight && styles.height > this.options.maxHeight) {
        styles.height = this.options.maxHeight;
      }

      if (styles.height === -1) {
        styles.height = '';
      } else {
        styles.height = styles.height + 'px';
      }

      this.$element.css(styles);
    },
    shouldRecalculateHeightFromPaddingBottom: function () {
      return !this.options.preserveAspectRatio && this.options.recalculateHeightFromPaddingBottom;
    }
  };

  FullWidth.$window = $(window);
  FullWidth.windowSize = {
    width: null,
    height: null
  };

  FullWidth.updateWindowSize = function () {
    FullWidth.windowSize.width = FullWidth.$window.width();
    FullWidth.windowSize.height = FullWidth.$window.height();
  };

  FullWidth.listener = function () {
    FullWidth.updateWindowSize();
    $.each(FullWidth.instances, function (index, instance) {
      instance.reader();
    });
    $.each(FullWidth.instances, function (index, instance) {
      instance.resetWriter();
    });
    $.each(FullWidth.instances, function (index, instance) {
      instance.resetReader();
    });
    $.each(FullWidth.instances, function (index, instance) {
      instance.writer();
    });
  };

  $.fn.fullWidth = function (option) {
    return this.each(function () {
      var $this = $(this),
          data = $this.data("fullWidth"),
          dataOptions = $this.data('full-width-options'),
          options = $.extend({}, $.fn.fullWidth.defaults, typeof dataOptions === "object" && dataOptions, typeof option === "object" && option),
          action = typeof option === "string" ? option : null;
      if (typeof data !== 'object') {
        data = new FullWidth(this, options);
        $this.data("fullWidth", data);
      }
      if (action) {
        data[action]();
      }
    });
  };

  $.fn.fullWidth.defaults = {
    preserveAspectRatio: true,
    recalculateHeightFromPaddingBottom: false,
    minHeight: false,
    maxHeight: false,
    minVerticalWhitespaceToViewport: false
  };

  window.FullWidth = FullWidth;

  $(window).resize(FullWidth.listener);

  /*============================*/
  /* FULLWIDTH ELEMENT DATA-API */
  /*============================*/

  $(function () {
    $("[data-full-width]").fullWidth();
  });
})(jQuery);

