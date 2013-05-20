#Edicy javascript plugins

Various javascrpt plugins and widgets for Edicy cms.

## Form plugins

### Edicy Ajax Form plugin

It is an jQuery plugin that makes Edicy forms submit with ajax. It handles all error messages to be displayed as usual by the side of form areas.

    <script type="text/javascript">
        $('#content form').edicyAjaxForm({
            success: function(text) {
                alert(text)
            },
            error: function(text) {
                alert(text);
            }
        });
    </script>
    
### Edicy Form placeholders

jQuery plugin that Makes form field titles displayed as placeholders.
Works together with [mathiasbynens/jquery-placeholder](https://github.com/mathiasbynens/jquery-placeholder) for making placeholder support to browsers without html5 placeholder support.

    <script type="text/javascript">
      $('#content form').edicyFormPlaceholders();
    </script>
