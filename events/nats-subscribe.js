var config = require('./nats-config'),
    nats = require('nats').connect({
       url: 'nats://athega.se:4222',
       token: config.token
    });

nats.subscribe('jullunch.mulled_wine.total', function(data, reply, name) {
    console.log(name, data);
});
