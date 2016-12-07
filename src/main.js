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

        var $currentPage = $pages.filter('.active');
        $currentPage.removeClass('active');
        $page.addClass('active');
        if (!$currentPage.is($page)) $currentPage.triggerHandler('pause');
        $page.triggerHandler('play');

        var $logoAnimation = $('body > h1');
        $logoAnimation.triggerHandler(!$page.is('.slide') ? 'play' : 'pause');

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

    function updateItemPages() {
        return $('main').triggerHandler('updateItemPages');
    }

    function updateMulledWinePage() {
        updateItemPages().done(function() {
            subscription($pages.filter('#mulled_wine'));
        });
    }

    function updateDrinkPage() {
        updateItemPages().done(function() {
            subscription($pages.filter('#drink'));
        });
    }

    function updateFoodPage() {
        updateItemPages().done(function() {
            subscription($pages.filter('#food'));
        });
    }

    function updateCoffeePage() {
        updateItemPages().done(function() {
            subscription($pages.filter('#coffee'));
        });
    }

    function updateAttendancePage() {
        updateItemPages().done(function() {
            subscription($pages.filter('#attendance'));
        });
    }

    function updateGuestsPage() {
        var $page = $pages.filter('#guests');
        return $page.triggerHandler('update').done(function() {
            subscription($page);
        });
    }


    function initCompaniesPage() {
        var $page = $pages.filter('#companies');
        return $page.triggerHandler('reload');
    }

    function updateCompaniesPage(company) {
        var $page = $pages.filter('#companies');
        $page.triggerHandler('update', [company.name, company.count]);
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
    $.when(updateItemPages(), updateGuestsPage(), initCompaniesPage(), initAds).done(function() {
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
        updateGuestsPage();
        updateArrivalPage(guest);
    });
    listen("guest-departure", updateDeparturePage);
    listen("guests-arrived.total", updateAttendancePage);
    listen("guests-departed.total", updateAttendancePage);
    listen("company-arrived", updateCompaniesPage);
    listen("mulled_wine.total", updateMulledWinePage);
    listen("drink.total", updateDrinkPage);
    listen("food.total", updateFoodPage);
    listen("coffee.total", updateCoffeePage);
});
