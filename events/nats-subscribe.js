var Nats = require('nats'),
    config = require('./nats-config'),
    url = 'nats://athega.se:4222',
    nats = Nats.connect({
       url: url,
       token: config.token
    }),
    event = 'jullunch.*';

nats.subscribe(event, console.log);

console.log('Subscribing to "'+ event + '" from '+ url);
