$(function() {
    'use strict';

    var config = infographics.config,
        $main = $('main'),
        $itemPages = $main.children('#mulled_wine, #drink, #food, #coffee'),
        $attendancePage = $main.children('#attendance');

    $itemPages.on('play', function(event) {
        var $page = $(this),
            $list = $page.find('ul');

        return $.get(config.stateDataURL, function(state) {
            var count = state.data[$page.attr('id')];
            $page.data('count', count);
            $page.find('h3').text(count);
            addItems($list, count);
        });
    });

    $attendancePage.on('play', function(event) {
        var $page = $(this),
            $list = $page.find('ul');

        return $.get(config.stateDataURL, function(state) {
            $page.data('count', state.data.arrived);
            $page.find('.arrived > h3').text(state.data.arrived);
            $page.find('.present > h3').text(state.data.arrived - state.data.departed);
            $page.find('.departed > h3').text(state.data.departed);
            addItems($list, state.data.arrived).eq(-state.data.departed).addClass('departed');
        });
    });

    $itemPages.add($attendancePage).on('pause', function(event) {
        var $page = $(this);
        $page.find('ul').empty();
        $page.find('h3').empty();
    });

    function addItems($list, count) {

        // Sine frequencies
        var rules = document.styleSheets[0].cssRules,
            durations = [
                (4 + 3 * Math.random()), // wave-scale
                1,                       // pop-in
                (4 + 3 * Math.random()), // wave-x-left
                (4 + 3 * Math.random()), // wave-x-margin
                (3 + 2 * Math.random()), // wave-y-top
                (3 + 2 * Math.random())  // wave-y-margin
            ];

        for (var i = 0; i < rules.length; i++) {
            if (rules[i].selectorText == 'main > .items > ul > li') {
                rules[i].style['animation-duration'] =
                    durations[0] + 's, ' + // wave-scale
                    durations[1] + 's, ' + // pop-in
                    durations[2] + 's, ' + // wave-x-left
                    durations[3] + 's, ' + // wave-x-margin
                    durations[4] + 's, ' + // wave-y-top
                    durations[5] + 's';    // wave-y-margin

                break;
            }
        }

        // Sine phases
        var offsets = [
               durations[1],                        // wave-scale, start after pop-in is done.
               0,                                   // pop-in
               -durations[2] * (1 + Math.random()), // wave-x-left, start waves anywhere in the cycle, with negative offset to make sure they have started when pop-in starts.
               -durations[3] * (1 + Math.random()), // wave-x-margin
               -durations[4] * (1 + Math.random()), // wave-y-top
               -durations[5] * (1 + Math.random())  // wave-y-margin
            ],
            expand = 0.5 + -0.8 * (Math.sin((Math.PI / 2) * Math.min(config.maxItems, count) / config.maxItems)),
            delays = [
                undefined,                 // wave-scale
                0.7 + 0.5 * Math.random(), // pop-in
                0.3 + expand + 0.2 * Math.random(), // wave-x-left
                0.4 + expand + 0.2 * Math.random(), // wave-x-margin
                0.3 + expand + 0.3 * Math.random(), // wave-y-top
                0.4 + expand + 0.3 * Math.random()  // wave-y-margin
            ];

        return $list.empty()
            .append('<li>'.repeat(Math.min(config.maxItems, count)))
            .children()
            .css('animation-delay', function(i) {
                return (offsets[0] + i * delays[1]) + 's,' + // wave-scale, relative to pop-in delay.
                       (offsets[1] + i * delays[1]) + 's,' + // pop-in
                       (offsets[2] + i * delays[2]) + 's,' + // wave-x-left
                       (offsets[3] + i * delays[3]) + 's,' + // wave-x-margin
                       (offsets[4] + i * delays[4]) + 's,' + // wave-y-top
                       (offsets[5] + i * delays[5]) + 's';   // wave-y-margin
            });
    }

});
