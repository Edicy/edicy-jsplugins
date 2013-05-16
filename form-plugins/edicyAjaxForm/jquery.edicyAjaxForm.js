(function($) {
    /* example can be found at http://www.edicy.com/developer/code-examples/javascript-tricks/ajax-forms */
    
    var defaults = {
        success: function(text) {
            // alert(text);
        },
        error: function(text) {
            // alert(text);
        }
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
        },
        
        handleSubmit: function(event) {
            event.preventDefault();
            this.clearErrors();
            $.ajax({
                method: 'post',
                data: this.$el.serialize(),
                url: window.location,
                success: $.proxy(this.handleAjaxSuccess, this),
                error: $.proxy(this.handleAjaxError, this)
            });
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