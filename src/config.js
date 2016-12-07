$(function() {
    'use strict';

    var base = 'https://jullunch-backend.athega.se/',
        data = base, // 'data/',
        ext = ''; // '.json';

    window.infographics = {
        config: {
            eventSourceURL: base + 'stream',
            stateDataURL: data + 'current_state' + ext,
            guestsDataURL: data + 'latest_check_ins' + ext,
            companiesDataURL: data + 'companies_toplist' + ext,
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
