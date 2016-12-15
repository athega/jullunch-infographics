$(function() {
    'use strict';

    var config = infographics.config,
        $page = $('main > #buzzwords'),
        $list = $page.find('ul'),
        words = [
             'Server-Sent Events', 'Sax', 'Lamineringsmaskin', 'SVG',
             'Babel', 'D3.js', 'EventSource', 'Node.js', 'Buntband',
             'HTML', 'CSS 3D', 'JavaScript', 'jQuery', 'Eltejp', 'Dlib', 'libcurl',
             'Tessel', 'Neopixel', 'Lödkolv', 'Krympslang', 'Blender',
             'Canvas', 'Go', 'NATS Streaming', 'MongoDB', 'RFID', 'OpenCV',
        ],
        t = 0,
        zi_word = 4,
        zi_snowflake = 9,
        zmax = 200,
        zmin = -4600,
        omax = 100,
        omin = -2400,
        snowflakes = {
            count: 32,
            minsize: 4,
            maxsize: 6,
        };

    function update() {
        $list.children().css('transform', function(i) {
            var p = $(this).data()
            p.z = p.z + (i < words.length ? zi_word : zi_snowflake);

            if (p.z > zmax) {
                p.r = Math.random() * 100 - 50;
                p.a = Math.random() * Math.PI * 2;
                p.z = zmin + Math.random() * 200;
            }

            t += 0.0002;
            p.x = Math.sin(t + p.a) * p.r;
            p.y = Math.cos(t + p.a) * p.r;

            var rotateZ = i < words.length ? '' : 'rotateZ('+ (p.a - t) +'rad) ';
            return 'translate3D('+ p.x +'vw,'+ p.y +'vh,'+ p.z +'vmax) '+ rotateZ +'translate(-50%, -50%)';
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

        $list.empty();

        shuffle(words);

        for (var i = 0; i < words.length; i++) {
            $list.append($('<li>').text(words[i]));
        }

        for (var i = 0; i < snowflakes.count; i++) {
            $list.append(
                $('<li>').append(
                    $('<img>', {src: 'images/snowflake' + Math.floor(Math.random() * 9 + 1) + '.svg'})
                        .css('width', (Math.random() * (snowflakes.maxsize - snowflakes.minsize) + snowflakes.minsize) + 'vmin')
                )
            );
        }

        $list.children().each(function() {
            var p = $(this).data();
            p.r = Math.random() * 100 - 50;
            p.a = Math.random() * Math.PI * 2;
            p.z = Math.random() * (zmax - zmin) * 1.6 + zmin * 2.4;

        });

        if (!update.animationFrameRequested) {
            update.animationFrameRequested = requestAnimationFrame(update);
        }
    });

    $page.on('pause', function(event) {
        $list.empty();

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
