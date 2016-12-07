$(function() {
    'use strict';

    var config = infographics.config,
        $page = $('main > #guests'),
        $list = $page.find('ol'),
        scrollTimeOut;

    $page.on('play', function(event) {
        $list.removeClass('update').stop(true).prop('scrollTop', 0);

        function scroll() {
            $list.animate({'scrollTop': scrollDirection = scrollDirection ? 0 : scrollTopMax}, {duration: scrollDuration, complete: function() { scrollTimeOut = setTimeout(scroll, 2000) }});
        }

        var itemHeight = $list.find('li').outerHeight(true),
            visibleItems = $list.innerHeight() / itemHeight,
            scrollTopMax = $list.prop('scrollHeight') - $list.innerHeight(),
            scrollDelay = 1.5 * 1000 * (visibleItems - 1) - 500,
            scrollDuration = 1.5 * 1000 * scrollTopMax / itemHeight,
            scrollDirection;

        clearTimeout(scrollTimeOut);
        scrollTimeOut = setTimeout(scroll, scrollDelay);
    });

    $page.on('update', function(event) {
        var updated = $.Deferred();

        function update() {
            $.get(config.guestsDataURL, function(guests) {
                $list.empty();
                guests.data.forEach(function(guest) {
                    $list.prepend($('<li>')
                        .text(guest.name)
                        .prepend($('<div>').text(guest.company))
                        .prepend($('<img>').css({
                            'background-image': 'url("images/bubble-background.png"), url("' + (guest.image_url && guest.image_url.indexOf('.uploads.im/') == -1 ? guest.image_url : 'images/santa.png') + '")',
                            'background-color': d3.schemeCategory10[Math.floor(Math.random()*d3.schemeCategory10.length)]
                        }))
                        .append(guest.arrived_at && $('<time>', {datetime: guest.arrived_at}).text( guest.arrived_at.split('T')[1].split(/:\d+\./)[0] ))
                    )
                });

                $list.children()
                    .css('animation-delay', function(i) {
                        return (0 + i * 0.4) + 's,' + // guests-wave-x
                               (-2 + i * 0.4) + 's,' + // guests-wave-y
                               (0 + i * 1.5) + 's';    // pop-in
                    })
                    .css('transition-delay', function(i) {
                        return (8  * 0.1 - i * 0.1) + 's'; // pop-out
                    });

                updated.resolve();
            });
        }

        if ($page.is('.active')) {
            $list.addClass('update');
            setTimeout(update, 1000);
        } else {
            update();
        }

        return updated;
    });

});
