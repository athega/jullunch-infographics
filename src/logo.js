$(function() {
    'use strict';

    var i = 0,
        j = 0,
        $h1 = $('body > h1');

    $h1.load($h1.find('> img').attr('src'));

    function update() {
        var si = Math.sin(i += 0.037),
            cj = Math.cos(j += 0.043),
            azimuth = Math.atan2(cj, si) * 180 / Math.PI,
            dx = -si * 4,
            dy = -cj * 4;

        $('#distant-light').attr('azimuth', azimuth);
        $('#drop-shadow').css('transform', 'translate(' + dx + 'px,' + (dy + 2) + 'px)');
        $('#edge-logo').css('transform', 'translate(' + -dx/2 + 'px,' + (-dy/2 - 2) + 'px)');

        update.animationFrameRequested = requestAnimationFrame(update);
    }

    $h1.on({
        pause: function() {
            if (update.animationFrameRequested) {
                cancelAnimationFrame(update.animationFrameRequested);
                update.animationFrameRequested = false;
            }
        },
        play: function() {
            if (!update.animationFrameRequested) {
                update.animationFrameRequested = requestAnimationFrame(update);
            }
        }
    });
});
