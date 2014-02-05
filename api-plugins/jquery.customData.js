// Javascript toolkit for Edicy custom data API
// Author: Oliver Pulges (2014.01)
//
// Version: 1.0
// Dependencies: jQuery (http://jquery.com)
//
// Library source url: https://github.com/Edicy/edicy-jsplugins/blob/master/api-plugins/jquery.customData.js
// Documentation: http://www.edicy.com/developer/code-examples/javascript-tricks/custom-data-api-js-toolkit

(function($) {
    
    var defaults = {
        type: null, // Supported types: "page", "site", "article"
        id: null // Must be defined for "page" and "article"
    };
    
    var CustomField = function(options) {
        this.options = $.extend(defaults, options);
        this._callbacks = {};
    };
    
    CustomField.prototype = {
        get: function() {
            var key = (arguments && arguments[0] && (typeof arguments[0] === "string")) ? arguments[0] : null,
                opts = (key) ? ((arguments[1]) ? arguments[1] : null) : (arguments[0] || null),
                url = this.getUrl();
                
            if (url) {
                jQuery.ajax({
                    type: 'GET',
                    dataType: "json",
                    contentType: 'application/json',
                    url: url,
                    success: $.proxy(function (data) {
                      this.handleSuccess(data, 'get', key, opts);
                    }, this),
                    error: $.proxy(function (response) {
                      this.handleError(response, 'get', key, opts);
                    }, this)
                });
            }
            
        },
        
        set: function() {
            var key = (arguments && arguments[0] && (typeof arguments[0] === "string")) ? arguments[0] : null,
                data = (key) ? arguments[1] : arguments[0] || null,
                wrappedData = null,
                opts = (key) ? ((arguments[2]) ? arguments[2] : null) : (arguments[1] || null),
                url = this.getUrl(key);
            
            if (data !== null) {
                wrappedData = {};
                if (data instanceof Object) {
                    wrappedData[this.getTypeWrapper(key)] = {};
                    wrappedData[this.getTypeWrapper(key)].data = data;
                } else {
                    wrappedData[this.getTypeWrapper(key)] = data;
                }
            }
            
            if (url && wrappedData !== null) {
                jQuery.ajax({
                    type: 'PUT',
                    dataType: "json",
                    contentType: 'application/json',
                    url: url,
                    data: JSON.stringify(wrappedData),
                    success: $.proxy(function (data2) {
                        this.handleSuccess(data2, 'set', key, opts);
                    }, this),
                    error: $.proxy(function (response) {
                        this.handleError(response, 'set', key, opts);
                    }, this)
                });
            }
        },
        
        remove: function(key, opts) {
            var url = this.getUrl(key);
            
            if (key && url) {
                jQuery.ajax({
                    type: 'DELETE',
                    dataType: "json",
                    contentType: 'application/json',
                    url: url,
                    success: $.proxy(function (data) {
                        this.handleSuccess(data, 'remove', key, opts);
                    }, this),
                    error: $.proxy(function (response) {
                        this.handleError(response, 'remove', key, opts);
                    }, this)
                });
            }
        },
        
        handleSuccess: function(data, fname, key, opts) {
            var obj = data.data || data;
            if (key && fname === "get") {
                obj = obj[key];
            }
            opts && opts.success && opts.success(obj);
            this.trigger('success', obj, {
                type: fname,
                key: key
            });
        },
        
        handleError: function(response, fname, key, opts) {
            var data = (response.responseText) ? JSON.parse(response.responseText) : null;
            
            opts && opts.error && opts.error(data);
            
            this.trigger('error', data, {
                type: fname,
                key: key
            });
        },
        
        getUrl: function(key) {
            var url = null;
            switch (this.options.type) {
                case "page":
                    if (this.options.id) {
                        url = (key) ? '/admin/api/pages/' + this.options.id + '/data/' + key + '.json' : '/admin/api/pages/' + this.options.id + '.json';
                    }
                break;
                case "article":
                    if (this.options.id) {
                        url = (key) ? '/admin/api/articles/' + this.options.id + '/data/' + key + '.json' : '/admin/api/articles/' + this.options.id + '.json';
                    }
                break;
                case "site":
                    url = (key) ? '/admin/api/site/data/' + key + '.json' : '/admin/api/site.json';
                break;
            }
            return url;
        },
        
        getTypeWrapper: function(key) {
            return (key) ? "value" : this.options.type || false;
        },
        
        on: function(evname,callback) {
            if (!this._callbacks[evname]) {
              this._callbacks[evname] = $.Callbacks();
            }
            this._callbacks[evname].add(callback);
        },
        
        off: function(evname,callback) {
            if (!this._callbacks[evname]) {
                return;
            }
            if (callback) {
                this._callbacks[evname].remove(callback);
            } else {
                this._callbacks[evname].empty();
            }
            
        },
        
        trigger: function(evname, data, response) {
            if (this._callbacks[evname]) {
              this._callbacks[evname].fire(data, response);
            }
        }
    };
    
    window.CustomField = CustomField;
})(jQuery);