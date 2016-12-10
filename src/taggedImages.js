$(function() {
    'use strict';

    var config = infographics.config,
        $page = $('main > #tagged_images'),
        $list = $page.find('ol'),
        size = 40,
        r = size / 2 + Math.sqrt(size * size / 2),
        h = Math.sqrt(size * size - (size/2 * size/2)),
        a = Math.PI/2 - Math.atan2(Math.sqrt(size * size / 2), size / 2),
        a2 = Math.PI + a,
        zt = 0,
        xt = 0,
        yt = 0;

    function update() {

        var sz = Math.sin(zt += 0.0087),
            z = sz * 300 - 200,
            y = (yt += 1.2 - sz) % 360,
            x = Math.sin(xt += 0.0056 * (1 - sz) ) * 45;

        $list.css('transform', 'perspective(260vmin) translateZ('+ z +'vmin) rotateX('+ x +'deg) rotateY('+ y +'deg)');

        update.animationFrameRequested = requestAnimationFrame(update);
    }

    $page.on('play', function(event) {
        return $.get(config.taggedImagesURL, function(images) {
            $list.empty();

            for (var i = 0; i < 8; i++) {
                $list.append($('<li>', {'class': 'triangle'}).css('border-bottom-color', d3.schemeCategory10[Math.floor(Math.random()*d3.schemeCategory10.length)]));
            }

            for (var i = 0; i < 18; i++) {
                var image = images[i % images.length];
                $list.append($('<li>')
                    .append($('<figure>')
                        .append($('<img>', {src: image.url}))
                        .append($('<figcaption>').text(image.name))
                ))
            }

            var $faces = $list.children(),
                i = 0;

            $faces.eq(i++).css('transform', 'rotateY(45deg) translateZ('+ r +'vmin)  translateY('+ -size/2 +'vmin) rotateX('+ a +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-45deg) translateZ('+ r +'vmin)  translateY('+ -size/2 +'vmin) rotateX('+ a +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(135deg) translateZ('+ r +'vmin)  translateY('+ -size/2 +'vmin) rotateX('+ a +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-135deg) translateZ('+ r +'vmin)  translateY('+ -size/2 +'vmin) rotateX('+ a +'rad) translateY('+ -size/2 +'vmin)');

            $faces.eq(i++).css('transform', 'rotateY(45deg) translateZ('+ -r +'vmin)  translateY('+ size/2 +'vmin) rotateX('+ a2 +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-45deg) translateZ('+ -r +'vmin)  translateY('+ size/2 +'vmin) rotateX('+ a2 +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(135deg) translateZ('+ -r +'vmin)  translateY('+ size/2 +'vmin) rotateX('+ a2 +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-135deg) translateZ('+ -r +'vmin)  translateY('+ size/2 +'vmin) rotateX('+ a2 +'rad) translateY('+ -size/2 +'vmin)');

            $faces.eq(i++).css('transform', 'translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-45deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-135deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-180deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(135deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(45deg) translateZ('+ r +'vmin)');

            $faces.eq(i++).css('transform', 'rotateX(-45deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateX(-90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateX(-45deg) rotateY(180deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateX(45deg) rotateY(180deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateX(90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateX(45deg) translateZ('+ r +'vmin)');

            $faces.eq(i++).css('transform', 'rotateZ(-45deg) rotateY(-90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateZ(45deg) rotateY(90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateZ(45deg) rotateY(-90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateZ(-45deg) rotateY(90deg) translateZ('+ r +'vmin)');

            if (!update.animationFrameRequested) {
                update.animationFrameRequested = requestAnimationFrame(update);
            }
        });
    });

    $page.on('pause', function(event) {
        $list.empty().css('transform', '');

        if (update.animationFrameRequested) {
            cancelAnimationFrame(update.animationFrameRequested);
            update.animationFrameRequested = false;
        }
    });

});
