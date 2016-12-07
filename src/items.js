$(function() {
    'use strict';

    var config = infographics.config,
        $main = $('main'),
        $itemPages = $main.children('#mulled_wine, #drink, #food, #coffee'),
        $attendancePage = $main.children('#attendance');

    $main.on('updateItemPages', function(event) {
        return $.get(config.stateDataURL, function(state) {
            $itemPages.filter('#mulled_wine').triggerHandler('update', state.data.mulled_wine);
            $itemPages.filter('#food').triggerHandler('update', state.data.food);
            $itemPages.filter('#drink').triggerHandler('update', state.data.drink);
            $itemPages.filter('#coffee').triggerHandler('update', state.data.coffee);
            $attendancePage.triggerHandler('update', {arrived: state.data.arrived, departed: state.data.departed});
        });
    });

    $itemPages.on('update', function(event, count) {
        var $page = $itemPages.filter(this),
            $list = $page.find('ul');

        $page.data('count', count);
        $page.find('h3').text(count);
        addItems($list, count);
    });


    $attendancePage.on('update', function(event, update) {
        var $page = $attendancePage,
            data = $page.data(),
            $list = $page.find('ul');

        $page.data(update);
        $page.data('count', data.arrived);
        $page.find('.arrived > h3').text(data.arrived);
        $page.find('.present > h3').text(data.arrived - data.departed);
        $page.find('.departed > h3').text(data.departed);
        addItems($list, data.arrived).eq(-data.departed).addClass('departed');
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
            if (rules[i].selectorText == 'ul > li') {
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
