(function($) {

    // Fixes missing class in Voog
    $('.edy-texteditor-view').addClass('fci-editor');

    var ImgDropCatcher = function($el, options) {
        this.$el = $el;
        if (window.Edicy && window.Edicy.jQuery) {
            this.init();
        } else {
            $(document).ready($.proxy(function(){
                this.init();
            }, this));
        }
    };

    ImgDropCatcher.prototype = {
        init: function() {
          Edicy.jQuery(this.$el.get(0)).droppable({
              scope: 'thumb',
              tolerance: 'pointer'
          }).on({
              'drop': $.proxy(this.handleDrop, this)
          });
        },

        handleDrop: function(event, ui) {
            if (ui.helper.data('model')) {
                var model = ui.helper.data('model');
                if (model.isImage()) {
                    this.$el.trigger('dropimage', model.get('src'));
                }
            }
        }
    };

    $.fn.imgDropCatcher = function (options) {
      var $e = this.eq(0),
          data = $e.data('edicyImgDropCatcher');
      if (!data) {
          $e.data('edicyImgDropCatcher', new ImgDropCatcher($e, options));
      }

      return $e;
    };

})(jQuery);
