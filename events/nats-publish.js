var Nats = require('nats'),
    config = require('./nats-config'),
    url = 'nats://athega.se:4222',
    nats = Nats.connect({
       url: url,
       token: config.token
    }),
    event = 'guest-arrival',
    events = {
        'check-in': {
            rfid: "1234"
        },

        'guest-arrival': {
            name: "Kalle Stropp",
            company: "Athega",
            image_url: '',
            arrived_at: '2016-11-22T16:01:10.649+01:00',
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
    console.log('Published "'+ event + '" to '+ url);
    nats.close();
    process.exit();
});
