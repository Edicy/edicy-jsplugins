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
