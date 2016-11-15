$(function() {
    'use strict';

    var eventSourceURL = 'https://jullunch-backend.athega.se/stream',
        stateDataURL = 'data/register.json',
        guestsDataURL = 'data/guests.json',
        companiesDataURL = 'data/companies.json',
        adsURL = 'https://assets.athega.se/jullunch/ads.json',
        eventSource = new EventSource(eventSourceURL),
        maxItems = 64,
        loopTime = 30000,
        maxItemsLoopTime = 60000,
        subscribedLoopTime = 60000,
        slideLoopTime = 20000,
        $pages = $('main > div'),
        $subscribedPage;

    function showPrevious() {
        var $currentPage = $pages.filter('.active'),
            $prevPage = $currentPage.prev().length ? $currentPage.prev() : $pages.last();
        subscribe($prevPage);
        showPage($prevPage);
    }

    function showNext() {
        var $currentPage = $pages.filter('.active'),
            $nextPage = $currentPage.next().length ? $currentPage.next() : $pages.first();
        subscribe($nextPage);
        showPage($nextPage);
    }

    function subscribe($page) {
        if ($page.hasClass('slide')) return;
        $subscribedPage = $page;
        notification('Prenumererar på händelser för #' + $subscribedPage.attr('id'));
    }

    function subscription($page) {
        if ($page.is($subscribedPage)) {
            showPage($subscribedPage);
        }
    }

    function notification(message) {
        var $notification = $('#notification');
        $notification.addClass('active').text(message);
        clearTimeout(notification.hideTimeoutId);
        notification.hideTimeoutId = setTimeout(function() {
            $notification.removeClass('active');
        }, 1500);
    }

    function showPage($page) {
        history.replaceState({}, "", '#' + $page.attr('id'));

        $pages.removeClass('active');
        $page.addClass('active');

        cancelAnimationFrame(updateLogoAnimationFrame.requestId);
        if (!$page.is('.slide'))
            updateLogoAnimationFrame.requestId = requestAnimationFrame(updateLogoAnimationFrame);

        var time = loopTime,
            count = $page.data('count');

        if ($page.is($subscribedPage)) {
            time = subscribedLoopTime;
        }
        else if ($page.is('.slide')) {
            time = slideLoopTime;
        }
        else if (count) {
            time = loopTime + Math.min(maxItems, count) * (maxItemsLoopTime - loopTime) / maxItems;
        }
        clearTimeout(showRandomPage.timeoutId);
        showRandomPage.timeoutId = setTimeout(showRandomPage, time);
    }

    function showRandomPage() {
        var $loopPages = $pages.filter('.loop'),
            $page = $loopPages.eq(Math.floor(Math.random() * $loopPages.length));
        showPage($page);
    }

    function updatePage(name, count) {
        var $page = $pages.filter('#' + name),
            $list = $page.find('ul');

        $page.data('count', count);
        $page.find('h3').text(count);
        addItems($list, count);

        subscription($page);
    }

    function updateAttendancePage(update) {
        var name = 'attendance',
            $page = $pages.filter('#' + name),
            data = $page.data(),
            $list = $page.find('ul');

        $page.data(update);
        $page.data('count', data.arrived);
        $page.find('.arrived > h3').text(data.arrived);
        $page.find('.present > h3').text(data.arrived - data.departed);
        $page.find('.departed > h3').text(data.departed);
        addItems($list, data.arrived).eq(-data.departed).addClass('departed');

        subscription($page);
    }

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
            expand = 0.5 + -0.8 * (Math.sin((Math.PI / 2) * Math.min(maxItems, count) / maxItems)),
            delays = [
                undefined,                 // wave-scale
                0.7 + 0.5 * Math.random(), // pop-in
                0.3 + expand + 0.2 * Math.random(), // wave-x-left
                0.4 + expand + 0.2 * Math.random(), // wave-x-margin
                0.3 + expand + 0.3 * Math.random(), // wave-y-top
                0.4 + expand + 0.3 * Math.random()  // wave-y-margin
            ];

        return $list.empty()
            .append('<li>'.repeat(Math.min(maxItems, count)))
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

    function updateGuestsPage(guest) {
        var name = 'guests',
            $page = $pages.filter('#' + name),
            $list = $page.find('ol');

        $list.prepend($('<li>').text(guest.name + ', ' + guest.company));

        subscription($page);
    }

    function updateCompaniesPage(company) {
        var name = 'companies',
            $page = $pages.filter('#' + name),
            $list = $page.find('ol');

        $list.prepend($('<li>').text(company.name + ', ' + company.arrived));

        subscription($page);
    }

    function updateArrivalPage(guest) {
        var name = 'arrival',
            $page = $pages.filter('#' + name),
            $photo = $page.find('img');

        $page.find('span.name').text(guest.name);
        $page.find('span.arrived').text(guest.arrived);
        $page.find('span.arrived-company').text(guest['arrived-company']);
        $page.find('span.company').text(guest.company);
        $photo.attr('src', guest.img_url);

        subscription($page);
    }

    function updateDeparturePage(guest) {
        var name = 'departure',
            $page = $pages.filter('#' + name);

        $page.find('span.name').text(guest.name);

        subscription($page);
    }

    // Initial item data
    var initState = $.get(stateDataURL, function(data) {
        updatePage('mulled_wine', data.mulled_wine);
        updatePage('food', data.food);
        updatePage('drink', data.drink);
        updatePage('coffee', data.coffee);
        updateAttendancePage({arrived: data.arrived, departed: data.departed});
    });

    // Init latest guests
    var initGuests = $.get(guestsDataURL, function(guests) {
        guests.forEach(updateGuestsPage);
    });

    // Init companies toplist
    var initCompanies = $.get(companiesDataURL, function(companies) {
        companies.forEach(updateCompaniesPage);
    });

    // Init ad slides
    var initAds = $.get(adsURL, function(data) {
        var $template = $('template#slide'),
            $slide = $($template.html());

        for (var i = 0; i < data.length; i++) {
            $slide.attr('id', 'slide' + (i + 1));
            $slide.find('img').attr('src', data[i].url.replace('http://', 'https://'));
            $template.parent().append($slide.clone());
        }

        $template.remove();
    });

    $.when(initAds).done(function() {
        $pages = $('main > div');
        var $defaultPage = $pages.filter(location.hash || '#attendance');
        showPage($defaultPage);
    });

    // Manual paging
    $(document).on('keydown', function(event) {
        if (event.which == 37 || event.which == 39) {
            if (event.which == 37) showPrevious();
            else if (event.which == 39) showNext();
            event.preventDefault();
        }
    });


    // Event source events
    eventSource.onerror = function(event) {
        notification('Event source failed!');
    };

    function listen(event, handler) {
        return eventSource.addEventListener("jullunch." + event, function(event) {
            handler(JSON.parse(event.data));
        });
    }

    listen("guest-arrival", function(guest) {
        updateGuestsPage(guest);
        updateArrivalPage(guest);
    });
    listen("guest-departure", updateDeparturePage);
    listen("guests-arrived.total",  function(data) { updateAttendancePage({arrived: data.count}); });
    listen("guests-departed.total", function(data) { updateAttendancePage({departed: data.count}); });
    listen("company-arrived", updateCompaniesPage);
    listen("mulled_wine.total", function(data) { updatePage("mulled_wine", data.count); });
    listen("drink.total",       function(data) { updatePage("drink",       data.count); });
    listen("food.total",        function(data) { updatePage("food",        data.count); });
    listen("coffee.total",      function(data) { updatePage("coffee",      data.count); });
});
