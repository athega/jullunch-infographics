$(function() {
    'use strict';

    var base = 'https://jullunch-backend.athega.se/',
        assets = 'https://assets.athega.se/jullunch',
        data = base, // 'data/',
        ext = ''; // '.json';

    window.infographics = {
        config: {
            eventSourceURL: base + 'stream',
            stateDataURL: data + 'current_state' + ext,
            guestsDataURL: data + 'latest_check_ins' + ext,
            companiesDataURL: data + 'companies_toplist' + ext,
            adsURL: assets + '/ads.json',
            taggedImagesURL: assets + '/2016/athegajul_hashtag_images.json',
            tweetsURL: assets + '/2016/recent_tweets.json',
            maxItems: 64,
            loopTime: 30 * 1000,
            maxItemsLoopTime: 60 * 1000,
            subscribedLoopTime: 60 * 1000,
            slideLoopTime: 20 * 1000,
            watchdogTime: 30 * 60 * 1000,
        }
    };

});
