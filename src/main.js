$(function() {
    'use strict';

    var config = infographics.config,
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
        var time = config.loopTime,
            count = $page.data('count');

        if ($page.is(subscription.$page)) {
            time = config.subscribedLoopTime;
        }
        else if ($page.is('.slide')) {
            time = config.slideLoopTime;
        }
        else if (count) {
            time = config.loopTime + Math.min(config.maxItems, count) * (config.maxItemsLoopTime - config.loopTime) / config.maxItems;
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

    function updateGuestsPage(guest) {
        var $page = $pages.filter('#guests');
        $page.triggerHandler('update', [guest, subscription]);
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
    if (config.watchdogTime) setTimeout(function() {
        location.reload();
    }, config.watchdogTime);

    // Init item data
    var initState = $.get(config.stateDataURL, function(state) {
        updateItemPage('mulled_wine', state.data.mulled_wine);
        updateItemPage('food', state.data.food);
        updateItemPage('drink', state.data.drink);
        updateItemPage('coffee', state.data.coffee);
        updateAttendancePage({arrived: state.data.arrived, departed: state.data.departed});
    });

    // Init latest guests
    var initGuests = $.get(config.guestsDataURL, function(guests) {
        guests.data.forEach(updateGuestsPage);
    });

    // Init companies toplist
    var initCompanies = $.get(config.companiesDataURL, function(companies) {
        companies.forEach(updateCompaniesPage);
    });

    // Init ad slides
    var initAds = $.get(config.adsURL, function(data) {
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
    var eventSource = new EventSource(infographics.config.eventSourceURL);

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
