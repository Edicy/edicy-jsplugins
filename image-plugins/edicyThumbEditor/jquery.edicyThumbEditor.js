/* example can be found at http://www.edicy.com/developer/code-examples/javascript-tricks/image-binding-to-content */
(function($) {

    // Fixes missing class in Voog
    $('.edy-texteditor-view').addClass('fci-editor');

    var defaults = {
        placeholder: "Drag cover image for this post here.",
        dragHelp: "Drag image to adjust crop area.",
        editorHtml: '<div class="thumb-editor-wrapper" style="width: {{width_b}}px;">\
                        <div class="delete-btn"><span class="edy-ico edy-ico-close"></span></div>\
                        <div class="thumb-editor js-thumb-editor" style="width: {{width}}px; height: {{height}}px;">\
                          <span class="thumb-placeholder">\
                            {{placeholder}}\
                          </span>\
                        </div>\
                        <span class="thumb-additional-info">\
                          {{dragHelp}}\
                        </span>\
                      </div>',
        thumbHtml: '<div class="thumb-wrapper"><img class="inner-image" src="{{src}}" /></div>',
        useOriginalImage: false,
        width: 200,
        height: 200,
        editorEl: '.fci-editor'
    };

    var AppendThumb = function(el, options) {
        this.$el = $(el);
        this.options = $.extend(defaults, options);
        this.data = $(options.$dataInside).find('.js-thumb-saver-data').data('thumb-info');
        this.init();
    };

    AppendThumb.prototype = {
        init: function() {
            var moveHeight = (this.options.width / this.options.height >= this.data.width / this.data.height);

            this.$thumb = $(this.options.thumbHtml.replace(/{{\s*src\s*}}/gi, this.data.src));
            this.$thumb.width(this.options.width);
            this.$thumb.height(this.options.height);

            if (moveHeight) {
                this.$thumb.find('.inner-image').css({
                    'width': this.options.width + 'px',
                    'top': this.data.top
                });
            } else {
                this.$thumb.find('.inner-image').css({
                    'height': this.options.height + 'px',
                    'left': this.data.left
                });
            }
            this.$el.append(this.$thumb);
        }
    };

    var ThumbEditor = function(el, options) {
        this.options = $.extend(defaults, options);
        this.$el = $(el);
        this.$saveTo = (this.options.editorEl) ? this.options.$saveTo.find(this.options.editorEl) : this.options.$saveTo;
        this.data = null;
        if (window.Edicy && window.Edicy.jQuery) {
            this.init();
        } else {
            $(document).ready($.proxy(function(){
                this.init();
            }, this));
        }
    };

    ThumbEditor.prototype = {

        init: function() {
            if (window.Edicy && window.Edicy.jQuery) {
                this.$el.html(this.getEditor());
                this.data = this.getData();

                Edicy.jQuery(this.$el.find('.js-thumb-editor').get(0)).droppable({
                    scope: 'thumb',
                    tolerance: 'pointer'
                }).on({
                    'dropover': $.proxy(this.handleDropover, this),
                    'dropout': $.proxy(this.handleDropout, this),
                    'drop': $.proxy(this.handleDrop, this),
                    'mousedown': $.proxy(this.handleMouseDown, this)
                });

                this.$el.find('.delete-btn').on('click', $.proxy(this.handleDelete, this));

                if (this.data) {
                    this.changeImage();
                }
            }
        },

        // returns thumbnail editor element
        getEditor: function() {
            var html = this.options.editorHtml;
            html = html.replace(/{{\s*placeholder\s*}}/gi, this.options.placeholder);
            html = html.replace(/{{\s*dragHelp\s*}}/gi, this.options.dragHelp);
            html = html.replace(/{{\s*width\s*}}/gi, this.options.width);
            html = html.replace(/{{\s*height\s*}}/gi, this.options.height);
            html = html.replace(/{{\s*width_b\s*}}/gi, this.options.width + 2);

            return $(html);
        },

        getData: function() {
            var data = null;
            if (this.$saveTo.find('.js-thumb-saver-data').length > 0) {
                try {
                    data = $.parseJSON(this.$saveTo.find('.js-thumb-saver-data').attr('data-thumb-info'));
                } catch(err) {
                    data = null;
                }
            }
            return data;
        },

        setData: function() {
            var $d = null,
                imgtop = this.$el.find('.inner-image').css('top') || 0,
                imgleft = this.$el.find('.inner-image').css('left') || 0;

            if (this.$saveTo.find('.js-thumb-saver-data').length > 0) {
                $d = this.$saveTo.find('.js-thumb-saver-data');
            } else {
                $d =  $('<div/>', {'class': 'js-thumb-saver-data'}).appendTo(this.$saveTo);
            }

            $d.attr({
                'src': this.data.src,
                'data-thumb-info': '{"src":"' + this.data.src + '", "width": "' + this.data.width + '", "height": "' + this.data.height + '", "top": "' + imgtop + '", "left": "' + imgleft + '"}'
            });
        },

        handleDrop: function(event, ui) {
            this.$el.removeClass('over');
            if (ui.helper.data('model')) {
                var model = ui.helper.data('model');
                if (model.isImage()) {
                    this.data = {
                        "src": model.get((this.options.useOriginalImage) ? 'src' : 'large_thumbnail_src'),
                        "width": model.get('width'),
                        "height": model.get('height')
                    }
                    this.changeImage();
                }
            }
        },

        handleDropover: function() {
            this.$el.addClass('over');
        },

        handleDropout: function() {
            this.$el.removeClass('over');
        },

        handleMouseDown: function(event) {
            event.preventDefault();
            if (this.$el.find('.inner-image').length > 0) {
                var imgtop = parseInt(this.$el.find('.inner-image').css('top'), 10) || 0,
                    imgleft = parseInt(this.$el.find('.inner-image').css('left'), 10) || 0,
                    w = this.options.width,
                    h = this.options.height,
                    moveHeight = (w / h >= this.data.width / this.data.height);

                this.startPos = {
                    x: event.pageX,
                    y: event.pageY,
                    bgx: (moveHeight) ? 0 : imgleft,
                    bgy: (!moveHeight) ? 0 : imgtop
                };
                this.bindImgMoveEvents();
            }
        },

        handleMouseMove: function(event) {
            event.preventDefault();
            var pos = {x: event.pageX, y: event.pageY};
            this.changeImgPos(pos);
        },

        handleMouseOut: function(event) {
            var pos = {x: event.pageX, y: event.pageY};
            this.changeImgPos(pos);
            this.endImgReposition();
        },

        handleMouseUp: function(event) {
            var pos = {x: event.pageX, y: event.pageY};
            this.changeImgPos(pos);
            this.endImgReposition();
        },

        handleDelete: function() {
            this.$el.find('.inner-image').remove();
            this.$saveTo.find('.js-thumb-saver-data').remove();
            this.$el.find('.thumb-editor-wrapper').removeClass('active');
        },

        endImgReposition: function() {
            this.unbindImgMoveEvents();
            this.setData();
        },

        bindImgMoveEvents: function() {
            this.$el.find('.js-thumb-editor').on({
                'mousemove': $.proxy(this.handleMouseMove, this),
                'mouseout': $.proxy(this.handleMouseOut, this),
                'mouseup': $.proxy(this.handleMouseUp, this)
            });
        },

        unbindImgMoveEvents: function() {
            this.$el.find('.js-thumb-editor').off('mousemove');
            this.$el.find('.js-thumb-editor').off('mouseout');
            this.$el.find('.js-thumb-editor').off('mouseup');
        },

        changeImgPos: function(pos) {
            var $img = this.$el.find('.inner-image'),
                movex = pos.x - this.startPos.x,
                movey = pos.y - this.startPos.y,
                w = this.options.width,
                h = this.options.height,
                moveHeight = (w / h >= this.data.width / this.data.height),
                virth, virtw,
                nx, ny;


            if (moveHeight) {
                virth = (w / this.data.width) * this.data.height;
                ny = this.startPos.bgy + movey;
                if (ny < -1 * (virth - h)) { ny = -1 * (virth - h); }
                if (ny > 0) { ny = 0; }
                $img.css({'top': ny +"px"});
            } else {
                virtw = (h / this.data.height) * this.data.width;
                nx = this.startPos.bgx + movex;
                if (nx < -1 * (virtw - w)) { nx = -1 * (virtw - w); }
                if (nx > 0) { nx = 0; }
                $img.css({'left': nx +"px"});
            }
        },

        changeImage: function() {
            var $img = $('<img/>', {'src': this.data.src, 'class':"inner-image"}),
                w = this.options.width,
                h = this.options.height,
                moveHeight = (w / h >= this.data.width / this.data.height);

            this.$el.find('.thumb-editor-wrapper').addClass('active');
            if (this.$el.find('.inner-image').length > 0) {
                this.$el.find('.inner-image').remove();
            }

            this.$el.find('.js-thumb-editor').prepend($img);

            if (moveHeight) {
                $img.css({
                    'width': w + 'px',
                    'height': '',
                    'top': this.data.top || 0,
                    'left': 0
                });
            } else {
                $img.css({
                    'height': h + 'px',
                    'width': '',
                    'left': this.data.left || 0,
                    'top': 0
                });
            }
            this.setData();
        }


    };

    $.fn.edicyThumbEditor = function (options) {
        var $e = this.eq(0),
            data = $e.data('edicyThumbEditor');

        if (!data) {
            $e.data('edicyThumbEditor', new ThumbEditor($e, options));
        }

        return $e;
    };

    $.fn.edicyAppendThumb = function (options) {
        var $e = this.eq(0);
        $e.data('edicyAppendThumb', new AppendThumb($e, options));
        return $e;
    };

})(jQuery);
