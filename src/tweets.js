$(function() {
    'use strict';

    var config = infographics.config,
        $page = $('main > #tweets'),
        $list = $page.find('ul'),
        count = 10,
        zi_max = 4,
        zi_min = 0.6,
        zmax = 200,
        zmin = -4600,
        omax = 120,
        omin = -600,
        balls = {
            count: 18,
            minsize: 4,
            maxsize: 6,
            zi: 8,
        };

    function update() {
        $list.children().css('transform', function(i) {
            var p = $(this).data()
            p.z = p.z + (i < count ? (zi_min + (zi_max - zi_min) * (zmax - p.z) / (zmax - zmin)) : balls.zi);

            if (p.z > zmax) {
                p.r = Math.random() * 100 - 50;
                p.a = Math.random() * Math.PI * 2;
                p.z = zmin + Math.random() * 200;
            }

            var t = -3 * (p.z - zmin) / (zmax - zmin)
            p.x = Math.sin(t + p.a) * p.r;
            p.y = Math.cos(t + p.a) * p.r;

            return 'translate3D('+ p.x +'vw,'+ p.y +'vh,'+ p.z +'vmax) translate(-50%, -50%)';
        }).css('opacity', function(i) {
            var p = $(this).data();
            return p.z < zmin ? 0 :
                   p.z < omin ? (p.z - zmin) / (omin - zmin):
                   p.z > omax ? (p.z - zmax) / (omax - zmax) : 1;
        });

        update.animationFrameRequested = requestAnimationFrame(update);
    }

    $page.on('play', function(event) {
        $page.data('count', config.maxItems);

        return $.get(config.tweetsURL, function(tweets) {
            $list.empty();

            for (var i = 0; i < count; i++) {
                var tweet = tweets[i % tweets.length];
                $list.append($('<li>')
                         .append($('<blockquote>').text(tweet.text))
                         .append($('<div>').text('– ' + tweet.user.name))
                 );
            }

            for (var i = 0; i < balls.count; i++) {
                var size = Math.random() * (balls.maxsize - balls.minsize) + balls.minsize;
                $list.append(
                    $('<li>').append(
                        $('<img>').css({
                            'width': size + 'vmin',
                            'height': size + 'vmin',
                            'background-color': d3.schemeCategory10[Math.floor(Math.random()*d3.schemeCategory10.length)]
                        })
                    )
                );
            }

            $list.children().each(function() {
                var p = $(this).data();
                p.r = Math.random() * 100 - 50;
                p.a = Math.random() * Math.PI * 2;
                p.z = Math.random() * (zmax - zmin) * 2.2 + zmin * 2.6;
            });

            if (!update.animationFrameRequested) {
                update.animationFrameRequested = requestAnimationFrame(update);
            }
        });
    });

    $page.on('pause', function(event) {
        $list.empty();

        if (update.animationFrameRequested) {
            cancelAnimationFrame(update.animationFrameRequested);
            update.animationFrameRequested = false;
        }
    });

});
