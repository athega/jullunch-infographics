$(function() {
    'use strict';

    var eventSourceURL = 'https://jullunch-backend.athega.se/stream',
        stateDataURL = 'https://jullunch-backend.athega.se/current_state',
        guestsDataURL = 'https://jullunch-backend.athega.se/latest_check_ins',
        companiesDataURL = 'data/companies.json', // TODO: Change to 'https://jullunch-backend.athega.se/companies_toplist',
        adsURL = 'https://assets.athega.se/jullunch/ads.json',
        eventSource = new EventSource(eventSourceURL),
        maxItems = 64,
        loopTime = 30000,
        maxItemsLoopTime = 60000,
        subscribedLoopTime = 60000,
        slideLoopTime = 20000,
        watchdogTime = 30 * 60 * 1000,
        $pages = $('main > div');

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
        subscription.$page = $page;
        localStorage.setItem('subscription-page', '#' + $page.attr('id'));
        notification('Prenumererar på händelser för #' + $page.attr('id'));
    }

    function subscription($page) {
        if ($page.is(subscription.$page) || $page.is('.active')) {
            showPage($page);
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
        $page.addClass('active').triggerHandler('play');

        if (window.logoAnimation) {
            if (!$page.is('.slide'))
                logoAnimation.play();
            else
                logoAnimation.pause();
        }

        if (window.companiesBubbles) {
            if ($page.is('#companies'))
                companiesBubbles.play();
            else
                companiesBubbles.pause();
        }

        setRandomPageTimeout($page);
    }

    function setRandomPageTimeout($page) {
        var time = loopTime,
            count = $page.data('count');

        if ($page.is(subscription.$page)) {
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

    function updateItemPage(name, count) {
        var $page = $pages.filter('#' + name);
        $page.triggerHandler('update', count);
        subscription($page);
    }

    function updateAttendancePage(update) {
        var $page = $pages.filter('#attendance');
        $page.triggerHandler('update', update);
        subscription($page);
    }


    $pages.filter('#guests').on('play', function(event) {
        var $page = $(this),
            $list = $page.find('ol');
        $list.addClass('animation-reset').stop(true).prop('scrollTop', 0);
        setTimeout(function() {
            $list.removeClass('update animation-reset');

            function scroll() {
                $list.animate({'scrollTop': scrollDirection = scrollDirection ? 0 : scrollTopMax}, {duration: scrollDuration, complete: function() { updateGuestsPage.scrollTimeOut = setTimeout(scroll, 2000) }});
            }

            var itemHeight = $list.find('li').outerHeight(true),
                visibleItems = $list.innerHeight() / itemHeight,
                scrollTopMax = $list.prop('scrollHeight') - $list.innerHeight(),
                scrollDelay = 1.5 * 1000 * (visibleItems - 1) - 500,
                scrollDuration = 1.5 * 1000 * scrollTopMax / itemHeight,
                scrollDirection;

            clearTimeout(updateGuestsPage.scrollTimeOut);
            updateGuestsPage.scrollTimeOut = setTimeout(scroll, scrollDelay);
        }, 32);
    });

    function updateGuestsPage(guest) {
        var name = 'guests',
            $page = $pages.filter('#' + name),
            playing = $page.is('.active'),
            $list = $page.find('ol');

        function update() {
            $list.find('li:gt(16)').remove();
            $list.prepend($('<li>')
                .text(guest.name)
                .prepend($('<div>').text(guest.company))
                .prepend($('<img>').css({
                    'background-image': 'url("images/bubble-background.png"), url("' + (guest.image_url && guest.image_url.indexOf('.uploads.im/') == -1 ? guest.image_url : 'images/santa.png') + '")',
                    'background-color': d3.schemeCategory10[Math.floor(Math.random()*d3.schemeCategory10.length)]
                }))
                .append(guest.arrived_at && $('<time>', {datetime: guest.arrived_at}).text( guest.arrived_at.split('T')[1].split(/:\d+\./)[0] ))
            )
            .children()
            .css('animation-delay', function(i) {
                return (0 + i * 0.4) + 's,' + // guests-wave-x
                       (-2 + i * 0.4) + 's,' + // guests-wave-y
                       (0 + i * 1.5) + 's';    // pop-in
            })
            .css('transition-delay', function(i) {
                return (8  * 0.1 - i * 0.1) + 's'; // pop-out
            });

            subscription($page);
        }

        if (playing) {
            $list.addClass('update');
            setTimeout(update, 1000);
        } else {
            update();
        }
    }


    updateCompaniesPage.companies = {};
    function updateCompaniesPage(company) {
        var name = 'companies',
            $page = $pages.filter('#' + name);

        updateCompaniesPage.companies[company.name] = company.arrived;
        $page.data('count', Object.keys(updateCompaniesPage.companies).length * 6);

        if (window.companiesBubbles)
            companiesBubbles.update(company.name, company.arrived);

        subscription($page);
    }


    function updateArrivalPage(guest) {
        var $page = $pages.filter('#arrival');
        $page.triggerHandler('update', guest);
        subscription($page);
    }


    function updateDeparturePage(guest) {
        var name = 'departure',
            $page = $pages.filter('#' + name);

        $page.find('span.name').text(guest.name);

        subscription($page);
    }

    // Set watchdog timer to reload page.
    if (watchdogTime) setTimeout(function() {
        location.reload();
    }, watchdogTime);

    // Init item data
    var initState = $.get(stateDataURL, function(state) {
        updateItemPage('mulled_wine', state.data.mulled_wine);
        updateItemPage('food', state.data.food);
        updateItemPage('drink', state.data.drink);
        updateItemPage('coffee', state.data.coffee);
        updateAttendancePage({arrived: state.data.arrived, departed: state.data.departed});
    });

    // Init latest guests
    var initGuests = $.get(guestsDataURL, function(guests) {
        guests.data.forEach(updateGuestsPage);
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

    // When all initial updates are done.
    $.when(initState, initGuests, initCompanies, initAds).done(function() {
        // Restore subscription when all initial updates are done.
        subscription.$page = $pages.filter(localStorage.getItem('subscription-page'));

        // Show default or random page.
        $pages = $('main > div');
        var $defaultPage = $pages.filter(location.hash);
        if ($defaultPage.length)
            showPage($defaultPage);
        else
            showRandomPage();
    });

    // Manual paging
    $(document).on('keydown', function(event) {
        if (event.which == 37 || event.which == 39) {
            if (event.which == 37) showPrevious();
            else if (event.which == 39) showNext();
            event.preventDefault();
        }
    });

    // Manual paging on touch screens.
    var touchX, touchY, swipe;
    $(window).on({
        touchstart: function(event) {
            touchX = event.originalEvent.targetTouches[0].clientX;
            touchY = event.originalEvent.targetTouches[0].clientY;
            swipe = false;
        },
        touchmove: function(event) {
            var dx = event.originalEvent.targetTouches[0].clientX - touchX,
                dy = event.originalEvent.targetTouches[0].clientY - touchY;

            if (Math.abs(dx) > 100 && Math.abs(dy) < Math.abs(dx) / 4)
                swipe = Math.sign(dx) == 1 ? 'right' : 'left';
            else
                swipe = false;

            event.preventDefault();
        },
        touchend: function(event) {
            if (swipe == 'right') showPrevious();
            else if (swipe == 'left') showNext();
        },
    });


    // Event source events
    eventSource.onerror = function(event) {
        notification('Event source failed!');
        setTimeout(function() { location.href = location.pathname; }, 12000);
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
    listen("mulled_wine.total", function(data) { updateItemPage("mulled_wine", data.count); });
    listen("drink.total",       function(data) { updateItemPage("drink",       data.count); });
    listen("food.total",        function(data) { updateItemPage("food",        data.count); });
    listen("coffee.total",      function(data) { updateItemPage("coffee",      data.count); });
});
