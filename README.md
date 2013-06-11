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


## Image plugins

### Image alt titles

jQuery plugin that makes alt attribute of image to real titles. Useful in Edicy to make user editable titles under content images.

    <style type="text/css">
      .image-alt-title {
        background: rgba(0,0,0,0.5);
        color: white;
        padding: 0 10px;
      }
    </style>
    
    <script type="text/javascript">
      $('#content img').imageAltTitles();
    </script>
    
Wrapper and title element classes can be configured as follows:

    <script type="text/javascript">
      $('#content img').imageAltTitles({
        titleClass: 'image-alt-title',
        wrapperClass: 'image-alt-wrapper'
      });
    </script>
    
### Thumb editor - Image binding to content area

A jQuery based plugin that adds an fixed size image drag and drop area. User can change the image crop location. Data about image is saved to Edicy content area defined by user. It is useful if thumbnail images must be bound to pages or blog articles.

    <!-- Wrapper used for thumb editor rendering in editmode and for appending thumbs in other cases -->
    <div id="thumb-wrapper"></div>
    
    <!-- Content area where thumb data is bound --> 
    <div id="thumb-data-wrapper">
        {% contentblock name="thumb-content" only="text" %}{% endcontentblock %}
    </div>
    <script type="text/javascript" src="jQuery.edicyThumbEditor.js"></script>
    
    <script type="text/javascript">
      {% if editmode %}
        
        // Thumb editor binding for editmode
        $('#thumb-wrapper').edicyThumbEditor({
          $saveTo: $('#thumb-data-wrapper'),
          width: 200,
          height: 200
        });
        
      {% else %}
        
        // Binding thumb appender for appending thumbs to content
        $('#thumb-wrapper').edicyAppendThumb({
          $dataInside: $('#thumb-data-wrapper'),
          width: 200,
          height: 200 
        });
        
      {% endif %}
    </script>
    
####Configuration parameters:

*placeholder*: Placeholder text. Default: "Drag cover image for this post here."
*dragHelp*: Additional image editing helper text. Default: "Drag image to adjust crop area."
*editorHtml*: Thumb editor html. Default:

    <div class="thumb-editor-wrapper" style="width: {{width_b}}px;">
      <div class="delete-btn"><span class="edy-ico edy-ico-close"></span></div>
      <div class="thumb-editor js-thumb-editor" style="width: {{width}}px; height: {{height}}px;">
        <span class="thumb-placeholder">
          {{placeholder}}
        </span>
      </div>
      <span class="thumb-additional-info">
        {{dragHelp}}\
      </span>
    </div>
    
*thumbHtml*: Thumb html. Default:

    <div class="thumb-wrapper"><img class="inner-image" src="{{src}}" /></div>
    
*useOriginalImage*: If true full size original image is used for displaying thumbnail. Otherwise image filt to 800x600px. Default: false.
*width*: width of thumbnail box. Default: 200.
*height*: width of thumbnail box. Default: 200.