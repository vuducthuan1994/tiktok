$(document).ready(function() {
    $.fn.googleSuggest = function(opts) {
        opts = $.extend({ service: 'youtube', secure: false }, opts);

        var services = {
                youtube: { client: 'youtube', ds: 'yt' },
                books: { client: 'books', ds: 'bo' },
                products: { client: 'products-cc', ds: 'sh' },
                news: { client: 'news-cc', ds: 'n' },
                images: { client: 'img', ds: 'i' },
                web: { client: 'psy', ds: '' },
                recipes: { client: 'psy', ds: 'r' }
            },
            service = services[opts.service];
        opts.delay = 0;
        opts.source = function(request, response) {
            $.ajax({
                //url: 'https'+(opts.secure?'s':'')+'://clients1.google.com/complete/search',
                url: 'https://clients1.google.com/complete/search',
                dataType: 'jsonp',
                data: {
                    q: request.term,
                    nolabels: 't',
                    client: service.client,
                    ds: service.ds
                },
                success: function(data) {
                    response($.map(data[1], function(item) {
                        return { value: $("<span>").html(item[0]).text() };
                    }));
                }
            });
        };

        opts.select = function(event, ui) {
            $("#autoinput").val(ui.item.label);
            $("#autoform").submit();

        };

        return this.each(function() {
            $(this).autocomplete(opts);
        });
    }
    $('#autoinput').googleSuggest();
});