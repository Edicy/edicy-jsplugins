(function($) {
    
    var defaults = {
        template: "#content-fill-template",
        inputEl: "input",
        listEl: ".fill-list",
        searchBy: "title"
    };
    
    var ContentAutofill = function($el, options) {
        this.$el = $el;
        this.options = $.extend(defaults, options);
        this.$content = $(this.options.contentElement).find('.fci-editor');
        this.$input = this.$el.find(this.options.inputEl);
        this.$list = this.$el.find(this.options.listEl);
        this.init();
    };
    
    ContentAutofill.prototype = {
        init: function() {
            this.fetch($.proxy(function(elements) {
                this.elements = elements;
                this.$input.on("keypress", $.proxy(this.handleKeypress, this));
            }, this));
        },
        
        handleKeypress: function(event) {
            setTimeout($.proxy(function() {
                var val = this.$input.val();
                if (val.length > 0) {
                    this.showList(val);
                } else {
                    this.$list.html('');
                }
                
            }, this) ,0);
        },
        
        showList: function(val) {
            this.$list.html('');
            $.each(this.elements, $.proxy(function(idx, e) {
                if (e[this.options.searchBy] && e[this.options.searchBy].toLowerCase().indexOf(val.toLowerCase()) > -1) {
                    console.log('aa');
                    var $link = $('<a/>').attr('href', '#').html(e[this.options.searchBy]).data('element', e).click($.proxy(this.chooseElement, this));
                    this.$list.append($link);
                }
            }, this)); 
            
        },
        
        chooseElement: function(event) {
            event.preventDefault();
            var el = $(event.target).data('element'),
                html = this.fillTemplateWithElement(el);
            console.log(el);
            this.$content.html(html);
        },
        
        fillTemplateWithElement: function(e) {
            var s = $(this.options.template).html();
            $.each(e, function(key, val) {
                if (key != "values") {
                    var exp = "[[" + key + "]]";
                    s = s.replace(exp, val);
                }
            });
            if (e.values) {
                $.each(e.values, function(key, val) {
                    var exp = '[[values.' + key + ']]';
                    s = s.replace(exp, val);
                });
            }
            return s;
        },
        
        fetch: function(f) {
            this.$el.trigger('elements.loading');
            var page_id_txt = (this.options.pageId) ? 'page_id=' + this.options.pageId : '',
                url = '/admin/api/site/elements.json?' + page_id_txt;
                
            $.ajax({
                url: url,
                dataType: 'json',
                success: $.proxy(function(elements) {
                    this.$el.trigger('elements.loaded');
                    if (elements.length == 0) {
                        f(null);
                    } else {
                        f(elements);
                    }
                }, this),
                error: $.proxy(function() {
                    this.$el.trigger('elements.loaded');
                    this.$el.trigger('elements.error');
                    f(null);
                }, this)
            });
        }
    };
    
    $.fn.edicyContentAutofill = function(options, param) {
        if (options && typeof options == "string") {
            return null;
        } else {
            return this.each(function() {
                if (!$(this).data('content-autofill')) {
                    var o = new ContentAutofill($(this), options);
                    $(this).data('content-autofill', o);
                }
            });
        }
    };
})(jQuery);