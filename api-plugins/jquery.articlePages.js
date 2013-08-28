(function($) {
    
    var defaults = {
        template: "#article-box-template",
        perPage: 10,
        dateFormat: function(date) {
            return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        },
        older: "older &gt;",
        newer: "&lt; newer"
    };
    
    var template = function(html, replacements) {
        var ret = html;
        $.each(replacements, function(key, repl) {
            ret = ret.replace("[[" + key + "]]", repl);
        });
        return ret;
    };
    
    var ArticlePages = function($el, options) {
        this.$el = $el;
        this.currentPage = 1;
        this.options = $.extend(defaults, options);
        this.init();
    };
    
    ArticlePages.prototype = {
        init: function() {
            this.showPage(this.currentPage);
        },
        
        fetch: function(page, f) {
            this.$el.trigger('articles.loading');
            var tag_txt = (this.options.tags) ? 'tagged=' + this.options.tags.join(',') +'&' : '',
                page_id_txt = (this.options.pageId) ? 'page_id=' + this.options.pageId : '',
                url = '/admin/api/site/articles.json?' + tag_txt + 'page='+ page + '&per_page=' + this.options.perPage + '&' + page_id_txt;
            $.ajax({
                url: url,
                dataType: 'json',
                success: $.proxy(function(articles) {
                    this.$el.trigger('articles.loaded');
                    if (articles.length == 0) {
                        f(null);
                    } else {
                        f(articles);
                    }
                }, this),
                error: $.proxy(function() {
                    this.$el.trigger('articles.loaded');
                    this.$el.trigger('articles.error');
                    f(null);
                }, this)
            });
        },
        
        render: function(articles) {
            if (articles) {
                this.$el.html('');
                $.each(articles, $.proxy(function(idx, article) {
                    this.$el.append(template($(this.options.template).html(), {
                        "url": article.url,
                        "title": article.title,
                        "excerpt": article.excerpt,
                        "date": this.options.dateFormat(new Date(article.created_at)),
                        "author": article.author,
                        "body": article.body
                    }));
                }, this));
                if(this.$pageLinks) {
                    this.$pageLinks.find('.nr-btn.active').removeClass('active');
                    this.$pageLinks.find('.nr-btn[data-page="'+this.currentPage+'"]').addClass('active');
                }
            }
        },
        
        next: function() {
            if (!this.options.nr_articles || this.currentPage < Math.ceil(this.options.nr_articles / this.options.perPage)) {
                this.fetch(this.currentPage + 1, $.proxy(function(articles) {
                    if (articles) {
                        this.currentPage += 1;
                        this.render(articles);
                    }    
                }, this));
            }
        }, 
        
        prev: function() {
            if (this.currentPage > 1) {
                this.fetch(this.currentPage - 1, $.proxy(function(articles) {
                    if (articles) {
                        this.currentPage -= 1;
                        this.render(articles);
                    }    
                }, this));
            }
        },    
        
        showPage: function(nr) {
            this.fetch(nr, $.proxy(function(articles) {
                if (articles) {
                    this.currentPage = nr;
                    this.render(articles);
                }    
            }, this));
        },
        
        getPageLinks: function() {
            
            if (!this.$pageLinks) {
                var $list = $('<span></span>');
            
                
                
                $list.append($('<a href="#" class="newer-btn">'+ this.options.newer +'</a>').click($.proxy(function(event) {
                    event.preventDefault();
                    this.prev();
                }, this)));
                        
                if (this.options.nr_articles) {
                    var pages = Math.ceil(this.options.nr_articles / this.options.perPage);
                    for (var i=1; i <= pages; i++) {
                        $list.append($('<a href="#" class="nr-btn" data-page="'+i+'">'+i+'</a>').click($.proxy(function(event) {
                            event.preventDefault();
                            this.showPage(parseInt($(event.target).data('page'), 10));
                        }, this)));
                    }
                }
                
                $list.append($('<a href="#" class="older-btn">'+ this.options.older +'</a>').click($.proxy(function(event) {
                    event.preventDefault();
                    this.next();
                }, this)));
                
                this.$pageLinks = $list;
            }
            
            return this.$pageLinks;
        }
    };
    
    $.fn.articlePages = function(options, param) {
        if (options && typeof options == "string") {
            switch (options) {
                case "getObject":
                    return $(this).data('article-pages');
                break;
                case "next":
                    $(this).data('article-pages').next();
                break;
                case "prev":
                    $(this).data('article-pages').prev();
                break;
                case "showPage": 
                    if (param) {
                        $(this).data('article-pages').showPage(param);
                    }
                break;
                case "getPageLinks":
                    return $(this).data('article-pages').getPageLinks();
                break;
            }
        } else {
            return this.each(function() {
                if (!$(this).data('article-pages')) {
                    var o = new ArticlePages($(this), options);
                    $(this).data('article-pages', o);
                }
            });
        }
    };
})(jQuery);