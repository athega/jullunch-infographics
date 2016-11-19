var EventSource = require('eventsource'),
    url = 'https://jullunch-backend.athega.se/stream',
    event = 'jullunch.check-in',
    eventsource = new EventSource(url);

eventsource.addEventListener(event, function (event) {
    console.log(event.type, event.data);
});

console.log('Listening to "'+ event + '" from '+ url);
