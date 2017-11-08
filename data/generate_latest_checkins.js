

var data = {

        "meta": {
            "timestamp": "2016-12-07T11:08:13.930620103+01:00"
        },
        "data": [
        ]

    };

var imageIds = '0119c512 0119c512 0119c512 016c9612 01eeb512 1158d312 115bb312 116ab312 116bb312 11719912 119fa412 11a3d412 11cec312 2114c512 2124a712 2134a712 215ac512 2160d612 21b2c512 21cd9812 31289912 3137d412 313fd312 3148c512 314ca712 3150d312 31549912 3156d512 318bd112 31a59912 31b5d412 31c79812 31c99912 31e18712 31e1d112 31f59912 31fd9812 410fa712 4111a712 4113a712 4126c512 413b9712 4145d312 41479912 4153c512 4168c412 41ccd312 41e6c612 511d9712 515bb312 517cb712 5184a412 518db312 51c7c212 611ea712 6152d512 6160a912 61689512 618aa612 61c29812 710cdc12 71979512 71c6c612 71f1d112 8109d612 8117a512 8143c212 8169d312 81949512 819ea412 81dec312 81ec9512 81f4b412 81f4d312 9185b312 91c79712 a147c212 a15e9612 a173b512 a1c1c612 a1dab512 b14cd312 b153d612 b16b5d12 b1d3d312 b1dbd212 b1dea412 c1239612 c13bd312 c1409612 c160d312 c18cb312 c1d4a612 c1e1c312 d100d512 d103b812 d152a712 d1969512 d1b7c312 e142a612 e1456412 e170bb12 e18cb312 e1bfd312 e1f59512 f150d312 f15e7c12 f17ea612 f1aa7912 f1c09712 f1cea512 f1dca412 f1f3d312';

for (var i = 0; i < 16; i++) {
    data.data.push({
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
            image_url: 'http://assets.athega.se/jullunch/2016/images/guests/' + random(imageIds.split(' ')) + '.png',
            arrived_at: new Date(Date.now() + Math.random() * 86400000).toISOString(),
            arrived: Math.floor(Math.random() * 96 + 2),
            'arrived_company': Math.floor(Math.random() * 28 + 1),
        });
}

console.log(JSON.stringify(data, undefined, 2));

function random(a) {
    return a[Math.floor(Math.random()*a.length)];
}
