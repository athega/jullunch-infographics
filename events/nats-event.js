var config = require('./nats-config'),
    nats = require('nats').connect({
       url: 'nats://athega.se:4222',
       token: config.token
    }),
    event = 'mulled_wine.total',
    events = {
        'guest-arrival': {
            name: "Kalle Stropp",
            company: "Athega",
            arrived: 16,
            'arrived-company': 4,
        },

        'guest-departure': {
            name: "Leffe Kodare",
            company: "Foo AB"
        },

        'guests-arrived.total': {
            count: 8,
        },

        'guests-departed.total': {
            count: 3,
        },

        'company-arrived': {
            name: "Athega",
            arrived: 16,
        },

        'mulled_wine.total': {
            count: 24,
        },

        'drink.total': {
            count: 16,
        },

        'food.total': {
            count: 42,
        },

        'coffee.total': {
            count: 18,
        },
    };

nats.publish('jullunch.' + event, JSON.stringify(events[event]), function() {
    nats.close();
    process.exit();
});
