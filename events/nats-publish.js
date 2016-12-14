var Nats = require('nats'),
    config = require('./nats-config'),
    url = 'nats://athega.se:4222',
    nats = Nats.connect({
       url: url,
       token: config.token
    }),
    event = 'check-out',
    events = {
        'check-in': {
            rfid: "a3d30430"
        },

        'check-out': {
            rfid: "a3d30430"
        },

        'guest-arrival': {
            name: random([
                "Kalle Stropp", "Grodan Boll", "Plåt Nicklas", "Spöket Laban", "Molgan Månsson",
                "Stefan Pettersson", "Mika Timonen", "Owais Mansoor", "Magnus Olsson",
                "Dan Wester", "Hans-Göran Persson", "Ville Puhakainen", "Arvid Krantz",
                "Tommy Svensson", "Peter Hellberg",
            ]),
            company: random([
                "Lumano", "MagnIT AB", "Lemonwhale", "Fritidsresor", "Athega konsultnätverk",
                "Fisk & Asfalt", "Expressen", "TV 4", "Omni", "Bygg & Gräv", "Natur och Kultur",
                "UR", "Ericsson", "Aftonbladet", "Atari Corporation", "Athega", "SEB"
            ]),
            image_url: random([
                'https://pbs.twimg.com/profile_images/662214280368951296/gq5ztnJ5_400x400.png',
                'https://pbs.twimg.com/profile_images/699537749213368320/GJm0fl36_400x400.png',
                'https://pbs.twimg.com/profile_images/715186952962711552/w-6CMsDF_400x400.jpg',
                'https://pbs.twimg.com/profile_images/778530997826641921/4zJqh-0N_400x400.jpg',
                'https://pbs.twimg.com/profile_images/1671394528/johan_400x400.jpg',
                'https://pbs.twimg.com/profile_images/792509338439020544/07Csxxxx_400x400.jpg',
                'https://pbs.twimg.com/profile_images/771101587284590597/swYYjfSk_400x400.jpg',
                'https://pbs.twimg.com/profile_images/728347462134579202/iG5FFFVb_400x400.jpg',
                'https://pbs.twimg.com/profile_images/797243647628431360/4626QLMk_400x400.jpg',
                'https://pbs.twimg.com/profile_images/3188722524/5790e7b88809e42d6e02e2120189aaf2_400x400.jpeg',
                'https://pbs.twimg.com/profile_images/778921008979935232/5m0hKrUC_400x400.jpg',
                'https://pbs.twimg.com/profile_images/707537655190462466/OSomk7wD_400x400.jpg',
                'https://pbs.twimg.com/profile_images/458689841186611200/SMmZLt2Y_400x400.jpeg',
                'https://pbs.twimg.com/profile_images/1268665765/DSC_2399_400x400.jpg',
                'https://pbs.twimg.com/profile_images/323982494/marissa_new4_400x400.jpg',
                'https://pbs.twimg.com/profile_images/758784025997737984/mcJ9ZZxp_400x400.jpg',
                'https://pbs.twimg.com/profile_images/786665630544134146/R79FgreO_400x400.jpg',
            ]),
            arrived_at: new Date(Date.now() + Math.random() * 86400000).toISOString(),
            arrived: Math.floor(Math.random() * 96 + 2),
            arrived_company: Math.floor(Math.random() * 28 + 1),
        },

        'guest-departure': {
            name: "Leffe Kodare",
            company: "Foo AB"
        },

        'company-arrival': {
            name: "Athega",
            arrived: 16,
            departed: 2,
        },

        'company-departure': {
            name: "Athega",
            arrived: 16,
            departed: 3,
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

function random(a) {
    return a[Math.floor(Math.random()*a.length)];
}
