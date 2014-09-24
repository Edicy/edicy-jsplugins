(function($) {
    /* example can be found at http://www.edicy.com/developer/code-examples/javascript-tricks/ajax-forms */
    
    var defaults = {
        success: function(text) {
            // alert(text);
        },
        error: function(text) {
            // alert(text);
        },
        formdata_error: "Your browser is too old to support file upload from this form."
    };
    
    var EdicyAjaxForm = function(el, options) {
        this.$el = $(el);
        this.id = $(el).attr('id');
        this.options = $.extend(defaults, options);
        this.init();
    };
    
    EdicyAjaxForm.prototype = {
        init: function() {
            this.$el.submit($.proxy(this.handleSubmit, this));
            if (!window.FormData) {
                this.$el.find('.form_field_file').after('<div class="form_field_error">' + this.options.formdata_error + '</div>');
            }
        },
        
        handleSubmit: function(event) {
            event.preventDefault();
            var params = {
                    type: 'post',
                    url: window.location,
                    success: $.proxy(this.handleAjaxSuccess, this),
                    error: $.proxy(this.handleAjaxError, this)
                };
            
            if (window.FormData) {
                params.data = new FormData(this.$el.get(0));
                params.cache = false;
                params.contentType = false;
                params.processData = false;
            } else {
                params.data = this.$el.serialize();
            }
            
            this.clearErrors();
            $.ajax(params);
        },
        
        handleAjaxSuccess: function(data) {
            
            var $resultForm = $(data).find('#' + this.id);
            if ($resultForm.find('.form_error').length > 0) {
                this.showErrors($resultForm);
            } else {
                this.formSubmited($resultForm);
            }
        },
        
        handleAjaxError: function(jqXHR, textStatus, errorThrown) {
            alert('Network error');
        },
        
        clearErrors: function() {
            this.$el.find('.form_field_error, .form_error, .form_notice').remove(); 
        },
        
        showErrors: function($resultForm) {
            var $mainError = $resultForm.find('.form_error').clone(),
                $fields = $resultForm.find('.form_fields .form_field');
                
            this.$el.find('.form_area').prepend($mainError);
            $fields.each($.proxy(function(idx, field) {
                if ($(field).find('.form_field_error').length > 0) {
                    
                    var $err = $($(field).find('.form_field_error').clone());
                    this.$el.find('.form_fields .form_field:eq('+ idx +')').append($err);
                }
            }, this));
            this.options.error($resultForm.find('.form_error').text());
        },
        
        formSubmited: function($resultForm) {
            this.$el.find('.form_area').prepend($resultForm.find('.form_notice').clone());
            this.options.success($resultForm.find('.form_notice').text());
        } 
    };
    
    $.fn.edicyAjaxForm = function (options) {
        return this.each(function () {
            var data = $(this).data('edicyAjaxForm');
            if (!data) {
                $(this).data('edicyAjaxForm', new EdicyAjaxForm(this, options));
            }
        });
    };
    
})(jQuery);
