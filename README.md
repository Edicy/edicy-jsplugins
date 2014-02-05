#Edicy javascript plugins

Various javascript plugins and widgets for Edicy cms.

## API plugins

### Site custom data management wrapper

Javascript wrapper for Edicy custom data API. Enables user to save, retrieve and manage custom key:value pairs on page/site/article.
Set attributes are available to ligquid markup when rendering via `object.data.key` eg: `{{ article.data.bgcolor }}`

#### Usage
##### Initiation:
    var articleData = new CustomField({
        type: "article", // allowed values "article", "page", "site"
        id: {{ article.id }} // // Must be defined for "page" ({{page.id}}) or "article" ({{ article.id }}) 
    });

##### Binding to events: 
Avaliable events:

`success`, `error`

    var handleSuccess =  function(data, request) {
      var type = request.type; // "get", "set" or "remove"
      var key = request.key // the specific key that was given or null for batch get request
    };

    articleData.on('success',   handleSuccess);

    articleData.on('error', function(response,  request) {
      alert(response.message + ' Request:' +  request .type + ' Key:' + request.key);
    });

    articleData.off('success',  handleSuccess); 

##### Setting data: 

    // syntax: object.set(key, value, options);
    
    articleData.set({
      "bgcolor": "#abcdef"
    });
    
    articleData.set("bgcolor", "#abcdef");
    
    articleData.set("bgcolor", "#abcdef" {
      success: function(data) {
      },
      error: function(response) {
        alert(response.message);
      }
    });
  
  
##### Getting data: 
    // syntax: object.get(key, options);
    
    articleData.get();
    
    articleData.get({
      success: function(data) {
      },
      error: function(response) {
      }
    });
    
    articleData.get("bgcolor");
    
    articleData.get("bgcolor", {
      success: function(data) {
      },
      error: function(response) {
      }
    });
  
##### Removing key: 
    // syntax: object.remove(key, options);
    
    articleData.remove("bgcolor");
    articleData.remove("bgcolor", {
      success: function(data) {
      },
      error: function(response) {
      }
    });

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

    <style type="text/css">
      .article-box, #page-numbers a { background: #def; padding: 5px 10px; border-radius: 5px; margin-bottom: 10px; }
      #page-numbers a { padding: 5px; display: inline-block; margin-right: 5px; }
      #page-numbers a.active { background: #789; color: white; }
    </style> 

    <div id="article-page-example"><!-- articles will be rendered here --></div>
    <span id="page-numbers"></span><!-- navigation controls -->
    <span id="loading-status">Loading ...</span> <!-- simple loding indicator --> 
    
#####Script of binding:

    <!-- plugin needs jQuery to work -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

    <script type="text/javascript" src="jquery.articlePages.js"></script> 
    <script type="text/javascript">
        // initiates articles with 5 articles per page and  
        $('#article-page-example').articlePages({
            perPage: 5,
            nr_articles: {{ articles.size }}
        });
    
        // geting pagelinks jQuery object and adding it into suitable dom element 
        $('#page-numbers').append($('#article-page-example').articlePages('getPageLinks'));  

        // binding very simple loading indicator
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
        },
        nr_articles: {{ articles.size }}, // maximum number of articles must be passed from template to get pagination numbers. if omitted numbers will not be displayed between navigation arrows
        pageId: 123, // if multiple blogs are present on site adding blog listing page here limits results to that blog 
        tags: ["news", "releases"], // limits results to blog posts with given tags
        older: "older &gt;", // older button text
        newer: "&lt; newer" // newer button text
    });
  
#####Additional actions

jQueryElement.articlePages('prev'): navigates to previous older page

jQueryElement.articlePages('next'): navigates to next newer page

jQueryElement.articlePages('showPage', nr): navigates to page number "nr"

jQueryElement.articlePages('getPageLinks'): returns pagelinks jQuery object

jQueryElement.articlePages('getObject'): returns whole control object if ever needed

## Form plugins

### Edicy Ajax Form plugin

It is an jQuery plugin that makes Edicy forms submit with ajax. It handles all error messages to be displayed as usual by the side of form areas. File upload in form is supported only in modern browsers. In Internet Explorer case it means IE10+. In older browsers if file input is present an error message is displayed besides it and file is not sent with data. Error message can be configured with parameter "formdata_error".

    <script type="text/javascript">
        $('#content form').edicyAjaxForm({
            success: function(text) {
                alert(text)
            },
            error: function(text) {
                alert(text);
            },
            formdata_error: "Your browser is too old to support file upload from this form."
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