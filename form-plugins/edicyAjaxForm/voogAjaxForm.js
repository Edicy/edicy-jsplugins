var VoogAjaxForm = function(element, options) {
  var defaults = {
    success: function(text) {},
    error: function(text, errors) {}
  };

  this.element = element;
  this.id = element.id;
  this.options = this.extend(defaults, options);

  this.init();
};

VoogAjaxForm.prototype = {
  init: function() {
    if (window.FormData) {
      this.element.addEventListener('submit', this.handleSubmit.bind(this));
    }
  },

  extend: function(extendee, extender) {
    var result = extendee;

    for (var key in extender) {
      if (extender.hasOwnProperty(key)) {
        result[key] = extender[key];
      }
    }

    return result;
  },

  handleSubmit: function(event) {
    event.preventDefault();

    var data = new FormData(this.element);

    this.request = new XMLHttpRequest();

    this.request.open('POST', this.element.getAttribute('action') + '.json', true);
    this.request.send(data);

    this.request.onload = this.handleAjaxSuccess.bind(this);

    this.request.onerror = this.handleAjaxError.bind(this);

    this.clearErrors();
  },

  handleAjaxSuccess: function() {
    var data = JSON.parse(this.request.responseText);

    this.clearErrors();

    if (data && data.errors) {
      this.showErrors(data.errors);
    } else if (data.notice) {
      this.formSubmited(data.notice);
    } else {
      this.handleAjaxError();
    }
  },

  handleAjaxError: function() {
    alert('Network error');
  },

  clearErrors: function() {
    var errorNotices = this.element.querySelectorAll('.form_field_error, .form_error, .form_notice'),
        errorFields = this.element.querySelectorAll('.form_field_with_errors');

    for (var index = 0; index < errorNotices.length; index++) {
      var errorNotice = errorNotices[index];

      errorNotice.parentNode.removeChild(errorNotice);
    }

    for (var index = 0; index < errorFields.length; index++) {
      errorFields[index].classList.remove('form_field_with_errors');
    }
  },

  showErrors: function(errors) {
    var formArea = this.element.querySelector('.form_area');

    for (var id in errors) {
      if (errors.hasOwnProperty(id)) {
        if (id === 'base') {
            // Render all form notices
            for (var eb = errors[id].length; eb--;) {
              var formErrorNotice = document.createElement('div');

              formErrorNotice.classList.add('form_error');
              formErrorNotice.textContent = errors[id][eb];

              formArea.insertBefore(formErrorNotice, formArea.firstChild);
            }
        } else {
          // Find appropriate field and render errors to it
          // Finds by beginning of id to comply with radiobuttons and checkboxes
          var field = this.element.querySelector('[id^="field_' + id + '"]').parentNode;

          if (field) {
            for (var e = 0, emax = errors[id].length; e < emax; e++) {
              var fieldErrorNotice = document.createElement('div');

              fieldErrorNotice.classList.add('form_field_error');
              fieldErrorNotice.textContent = errors[id][e];

              field.appendChild(fieldErrorNotice);
            }

            field.classList.add('form_field_with_errors');
          }
        }
      }
    }

    this.options.error((errors.base && errors.base[0]) ? errors.base[0] : "Error", errors);
  },

  formSubmited: function(notice) {
    var successNotice = document.createElement('div'),
        formArea = this.element.querySelector('.form_area');

    successNotice.classList.add('form_notice');
    successNotice.textContent = notice;

    formArea.insertBefore(successNotice, formArea.firstChild)

    this.options.success(notice);
  }
};
