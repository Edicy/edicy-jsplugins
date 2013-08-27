(function($) {
    
    var defaults = {
        template: "#article-box-template",
        perPage: 10,
        dateFormat: function(date) {
            return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
        }
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
            }
        },
        
        next: function() {
            this.fetch(this.currentPage + 1, $.proxy(function(articles) {
                if (articles) {
                    this.currentPage += 1;
                    this.render(articles);
                }    
            }, this));
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
            }
        } else {
            return this.each(function() {
                if (!$(this).data('article-pages')) {
                    var o = new ArticlePages($(this));
                    $(this).data('article-pages', o);
                }
            });
        }
    };
})(jQuery);