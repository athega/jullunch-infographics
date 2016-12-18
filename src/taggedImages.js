$(function() {
    'use strict';

    var config = infographics.config,
        $pages = $('main').children('#tagged_images, #guest_images'),
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

        update.$list.css('transform', 'perspective(260vmin) translateZ('+ z +'vmin) rotateX('+ x +'deg) rotateY('+ y +'deg)');

        update.animationFrameRequested = requestAnimationFrame(update);
    }

    $pages.on('play', function(event) {
        var $page = $(this),
            $list = $page.find('ol');

        return $.get($page.is('#tagged_images') ? config.taggedImagesURL : config.guestsDataURL + '?limit=18', function(images) {
            $list.empty().parent('span').css('animation', '');

            if (images.data) images = images.data;

            shuffle(images);

            for (var i = 0; i < 8; i++) {
                $list.append($('<li>', {'class': 'triangle'}).css('border-bottom-color', d3.schemeCategory10[Math.floor(Math.random()*d3.schemeCategory10.length)]));
            }

            for (var i = 0; i < 18; i++) {
                var image = images[i % images.length];
                $list.append($('<li>')
                    .append($('<figure>')
                        .append($('<img>', {src: image.url || image.image_url}))
                        .append($('<figcaption>').text(image.name))
                ))
            }

            var $faces = $list.children(),
                i = 0;

            // Triangles top layer
            $faces.eq(i++).css('transform', 'rotateY(45deg) translateZ('+ r +'vmin)  translateY('+ -size/2 +'vmin) rotateX('+ a +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-45deg) translateZ('+ r +'vmin)  translateY('+ -size/2 +'vmin) rotateX('+ a +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(135deg) translateZ('+ r +'vmin)  translateY('+ -size/2 +'vmin) rotateX('+ a +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-135deg) translateZ('+ r +'vmin)  translateY('+ -size/2 +'vmin) rotateX('+ a +'rad) translateY('+ -size/2 +'vmin)');

            // Triangles bottom layer
            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateY(45deg) translateZ('+ -r +'vmin)  translateY('+ size/2 +'vmin) rotateX('+ a2 +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateY(-45deg) translateZ('+ -r +'vmin)  translateY('+ size/2 +'vmin) rotateX('+ a2 +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateY(135deg) translateZ('+ -r +'vmin)  translateY('+ size/2 +'vmin) rotateX('+ a2 +'rad) translateY('+ -size/2 +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateY(-135deg) translateZ('+ -r +'vmin)  translateY('+ size/2 +'vmin) rotateX('+ a2 +'rad) translateY('+ -size/2 +'vmin)');

            // Middle layer
            $faces.eq(i++).css('transform', 'translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-45deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-135deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(-180deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(135deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(45deg) translateZ('+ r +'vmin)');

            // Top layer
            $faces.eq(i++).css('transform', 'rotateX(45deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateX(90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateX(-45deg) rotateY(180deg) translateZ('+ r +'vmin)');

            $faces.eq(i++).css('transform', 'rotateZ(45deg) rotateY(-90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateZ(-45deg) rotateY(90deg) translateZ('+ r +'vmin)');

            // Bottom layer
            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateX(-45deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateX(-90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateX(45deg) rotateY(180deg) translateZ('+ r +'vmin)');

            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateZ(-45deg) rotateY(-90deg) translateZ('+ r +'vmin)');
            $faces.eq(i++).css('transform', 'rotateY(45deg) rotateZ(45deg) rotateY(90deg) translateZ('+ r +'vmin)');


            if (!update.animationFrameRequested) {
                update.$list = $list;
                update.animationFrameRequested = requestAnimationFrame(update);
            }
        });
    });

    $pages.on('pause', function(event) {
        var $page = $(this),
            $list = $page.find('ol');

        $list.empty().css('transform', '').parent('span').css('animation', 'none');

        if (update.animationFrameRequested) {
            cancelAnimationFrame(update.animationFrameRequested);
            update.animationFrameRequested = false;
        }
    });

    function shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }

});
