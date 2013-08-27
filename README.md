#Edicy javascript plugins

Various javascrpt plugins and widgets for Edicy cms.

## API plugins

### Edicy blog article pages fetcher

It is a jquery plugin that communicates with article api and fetches list with pagination.

#####Article template script:

    <script type="text/html" id="article-box-template">
      <div class="article-box">
        <div class="article-head">
          <a href="[[url]]">
            <span class="title">[[title]]</span>
          </a>
          <span class="date">[[date]]</span>
        </div>
        <div class="article-content">
            <p>[[excerpt]]</p>
            <p>[[body]]</p>
        </div>
      </div>
    </script>
    
#####HTML:

    <style>
      .article-box { background: #def; padding: 15px; border-radius: 5px; margin-bottom: 10px; }
    </style>

    <div id="article-page-example"><!-- articles will be rendered here --></div>
    
    <button id="article-page-next">&lt; Older </button>
    <button id="article-page-prev">Newer &gt;</button>
    <span id="loading-status">Loading ...</span>
    
#####Script of binding:

    <script type="text/javascript">
      // initiates articles
      $('#article-page-example').articlePages();
      
      // making prev and next buttons work
      $('#article-page-prev').click(function() {
          $('#article-page-example').articlePages('prev');
      });
      $('#article-page-next').click(function() {
        $('#article-page-example').articlePages('next');
      });
      
      // binding loading events to show user
      $('#article-page-example').on({
        'articles.loading': function() { $('#loading-status').html('Loading ...'); },
        'articles.loaded': function() { $('#loading-status').html(''); }
      });
    </script>
    
####Configuration parameters:

#####Tempate replacement strings are:

[[url]]: url of article

[[title]]: title of article

[[excerpt]]: article excerpt

[[date]]: date of article. defult format is (2013-11-01), but can be redefined in option dateFormat

[[author]]: author of article

[[body]]: the main article body
  
#####Options on initiation:
  
  $('#article-page-example').articlePages({
    template: "#article-box-template", // element of template
    perPage: 10, // how many articles per page
    dateFormat: function(date) {
        // for formating date object into string
        return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    }
  });
  
#####Additional actions

jQueryElement.articlePages('prev'): gets previous older page
jQueryElement.articlePages('next'): gets next newer page
jQueryElement.articlePages('showPage', nr): gets page umber "nr"

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
    
    <link href="edicyThumbEditor.css" rel="stylesheet" />
    
    <!-- Wrapper used for thumb editor rendering in editmode and for appending thumbs in other cases -->
    <div id="thumb-wrapper"></div>
    
    <!-- Content area where thumb data is bound --> 
    <div id="thumb-data-wrapper">
        {% contentblock name="thumb-content" only="text" %}{% endcontentblock %}
    </div>
    <script type="text/javascript" src="jquery.edicyThumbEditor.js"></script>
    
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

**placeholder**: Placeholder text. Default: "Drag cover image for this post here."

**dragHelp**: Additional image editing helper text. Default: "Drag image to adjust crop area."

**editorHtml**: Thumb editor html. Default:

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
    
**thumbHtml**: Thumb html. Default:

    <div class="thumb-wrapper"><img class="inner-image" src="{{src}}" /></div>
    
**useOriginalImage**: If true full size original image is used for displaying thumbnail. Otherwise image filt to 800x600px. Default: false.

**width**: width of thumbnail box. Default: 200.

**height**: width of thumbnail box. Default: 200.