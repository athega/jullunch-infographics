$(function() {
    'use strict';

    var $page = $('main > #arrival'),
        $name = $page.find('h3'),
        $arrived = $page.find('span.arrived'),
        $arrivedCompany = $page.find('span.arrived-company'),
        arrivedInterval,
        arrivedCompanyInterval;

    $page.on('play', function(event) {
        var arrivedTarget = $arrived.data('count'),
            arrivedCount = 1;

        if (arrivedTarget > 0) {
            $arrived.text('…');
            clearInterval(arrivedInterval);
            arrivedInterval = setInterval(function() {
                $arrived.text(arrivedCount);
                if (++arrivedCount >= arrivedTarget)
                    clearInterval(arrivedInterval);
            }, 400 - Math.min(100, arrivedTarget) * 3);
        }

        var arrivedCompanyTarget = $arrivedCompany.data('count'),
            arrivedCompanyCount = 1;

        if (arrivedCompanyTarget > 0) {
            $arrivedCompany.text('…');
            clearInterval(arrivedCompanyInterval);
            arrivedCompanyInterval = setInterval(function() {
                $arrivedCompany.text(arrivedCompanyCount);
                if (++arrivedCompanyCount >= arrivedCompanyTarget)
                    clearInterval(arrivedCompanyInterval);
            }, 400 - Math.min(100, arrivedCompanyTarget) * 3);
        }
    });

    $page.on('pause', function(event) {
        clearInterval(arrivedInterval);
        clearInterval(arrivedCompanyInterval);
    });

    $page.on('update', function(event, guest) {
        $name.empty();
        for (var i in guest.name) {
            $name.append($('<b>').html(guest.name[i] != ' ' ? guest.name[i] : '&nbsp;').css('animation-delay', (-10 + i * 0.1) + 's,' + (i * 0.4) + 's'));
        }

        $page.find('span.arrived').data('count', guest.arrived).text('…');
        $page.find('span.arrived-company').data('count', guest.arrived_company).text('…');
        $page.find('span.company').text(guest.company);

        if (guest.arrived_at) {
            $page.find('time').attr('datetime', guest.arrived_at).text( guest.arrived_at.split('T')[1].split(/:\d+\./)[0] );
        }

        if (guest.image_url) {
            $page.find('img').replaceWith($('<img>').css({
                'background-image': 'url("images/bubble-background.png"), url("' + guest.image_url + '")',
                'background-color': d3.schemeCategory10[Math.floor(Math.random()*d3.schemeCategory10.length)]
            }));
        }
    });

});
