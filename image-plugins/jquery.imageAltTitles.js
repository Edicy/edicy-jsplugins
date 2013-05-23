(function($) {
    
    var defaults = {
        titleClass: 'image-alt-title',
        wrapperClass: 'image-alt-wrapper'
    };
    
    var ImageAltTitles = function(el, options) {
        this.$el = $(el);
        this.id = $(el).attr('id');
        this.options = $.extend(defaults, options);
        if (this.$el.height() > 0) {
            this.init();
        } else {
            this.$el.load($.proxy(this.init, this));
        }
    };
    
    ImageAltTitles.prototype = {
        init: function() {
            if (this.$el.attr('alt') && this.$el.attr('alt') != '') {
                
                this.imgAlignment = this.getAlign();
                this.$title = $('<div class="'+ this.options.titleClass +'">'+ this.$el.attr('alt') +'</div>');
                this.$wrap = $('<div/>').addClass(this.options.wrapperClass).css('position', 'relative');
                
                this.transferMargins();
                this.applyAlignment(this.imgAlignment);
                this.$el.removeAttr('align');
                
                this.$el.wrap(this.$wrap);
                this.$el.after(this.$title);
                this.$el.hover(
                    $.proxy(this.handleOver, this),
                    $.proxy(this.handleOut, this)
                );
            }
        },
        
        getAlign: function() {
            var alignment = 'none';
            if (this.$el.attr('align')) {
                alignment = this.$el.attr('align').toLowerCase();
            }
            return alignment;
        },
        
        applyAlignment: function(alignment) {
            this.$wrap.width(this.$el.width());
            if (alignment == 'left') {
                this.$wrap.css({
                    "float": "left"
                });
            } else if (alignment == 'right') {
                this.$wrap.css({
                    "float": "right"
                });
            } else {
                if (alignment == 'center' || alignment == 'middle') {
                    this.$wrap.css({
                        "margin": "0 auto"
                    });
                }
            }
        },
        
        transferMargins: function() {
            this.$wrap.css({
                'margin-left': this.$el.css('margin-left'),
                'margin-right': this.$el.css('margin-right'),
                'margin-top': this.$el.css('margin-top'),
                'margin-bottom': this.$el.css('margin-bottom')            
            });
            this.$el.css('margin', '0');
        },
        
        handleOver: function () {
            this.$title.addClass('active');
        },
        
        handleOut: function()  {
            this.$title.removeClass('active');
        }
    };
    
    $.fn.imageAltTitles = function (options) {
        return this.each(function () {
            var data = $(this).data('imageAltTitles');
            if (!data) {
                $(this).data('imageAltTitles', new ImageAltTitles(this, options));
            }
        });
    };
    
})(jQuery);