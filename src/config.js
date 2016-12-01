$(function() {
    'use strict';

    var base = 'https://jullunch-backend.athega.se/';

    window.infographics = {
        config: {
            eventSourceURL: base + 'stream',
            stateDataURL: base + 'current_state',
            guestsDataURL: base + 'latest_check_ins',
            companiesDataURL: base + 'companies_toplist',
            adsURL: 'https://assets.athega.se/jullunch/ads.json',
            maxItems: 64,
            loopTime: 30 * 1000,
            maxItemsLoopTime: 60 * 1000,
            subscribedLoopTime: 60 * 1000,
            slideLoopTime: 20 * 1000,
            watchdogTime: 30 * 60 * 1000,
        }
    };

});
