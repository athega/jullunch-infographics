'use strict';

$(function () {
    'use strict';

    var diameter = 640,
        initialTransitionDuration = 12000,
        initialTransitionDelay = 2000,
        updateTransitionDuration = 4000,
        updateTransitionDelay = 400,
        randomBubblesInterval = 14000,
        color = d3.scaleOrdinal(d3.schemeCategory10),
        svg = d3.select('#companies').append('svg').attr('viewBox', '0 0 ' + diameter + ' ' + diameter).attr('width', diameter).attr('height', diameter),
        pack = d3.pack().size([diameter, diameter]),
        data = {
        children: [],
        companies: {}
    };

    window.companiesBubbles = {
        update: function update(name, arrived) {
            if (data.companies[name]) {
                data.companies[name].size = arrived;
            } else {
                data.children.push(data.companies[name] = { name: name, size: Math.random() * 12 + 1 }); // TODO: Change random size to: arrived
            }
            return this;
        },
        pause: function pause() {
            clearInterval(updateRandomBubbles.interval);
            updateRandomBubbles.interval = false;
            resetBubbles();
            updateBubbles.playing = false;
            return this;
        },
        play: function play() {
            if (!updateRandomBubbles.interval) {
                companiesBubbles.update('random1', 0).update('random2', 0);
                updateRandomBubbles.interval = setInterval(updateRandomBubbles, randomBubblesInterval);
            }

            if (!updateBubbles.playing) {
                shuffle(data.children);
            }

            updateBubbles();
            updateBubbles.playing = true;
            return this;
        }
    };

    function updateBubbles() {
        var root = d3.hierarchy(data).sum(function (d) {
            return d.size;
        }),
            node = svg.selectAll('.node').data(pack(root).leaves());

        // New nodes
        var g1 = node.enter().append('g').attr('class', 'node').attr('transform', function (d) {
            return 'translate(' + diameter / 2 + ',' + diameter / 2 + ') scale(0)';
        }).style('display', function (d) {
            return d.data.name == 'random1' || d.data.name == 'random2' ? 'none' : 'inline-block';
        });

        var i = 0;
        g1.transition().duration(initialTransitionDuration).delay(function (d) {
            return i++ * initialTransitionDelay;
        }).ease(d3.easeBounce).attr('transform', function (d) {
            return 'translate(0,0) scale(1)';
        });

        var g2 = g1.append('g').attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        });

        g2.append('image').attr('xlink:href', 'images/bubble-background.png').attr('x', function (d) {
            return -d.r;
        }).attr('y', function (d) {
            return -d.r;
        }).attr('width', function (d) {
            return d.r * 2;
        }).attr('height', function (d) {
            return d.r * 2;
        });

        var blendModes = ['color', 'color-burn', 'color-dodge', 'hard-light', 'multiply', 'overlay', 'screen', 'soft-light'];
        g2.append('circle').attr('r', function (d) {
            return d.r;
        }).style('mix-blend-mode', function (d) {
            return blendModes[Math.floor(Math.random() * blendModes.length)];
        }).style('fill', function (d) {
            return color(d.data.name);
        });

        g2.append('text').attr('dy', '.3em').style('text-anchor', 'middle').attr('lengthAdjust', 'spacingAndGlyphs').attr('textLength', function (d) {
            return d.r * 1.6;
        }).style('font-size', function (d) {
            return d.r * 0.9 - d.r * 0.8 * Math.min(24, d.data.name.length) / 24 + 'px';
        }).text(function (d) {
            return d.data.name;
        });

        // Updates
        i = 0;
        node.select('g').transition().duration(updateTransitionDuration).delay(function (d) {
            return i++ * updateTransitionDelay;
        }).ease(d3.easeBounce).attr('transform', function (d) {
            return 'translate(' + d.x + ',' + d.y + ') scale(1)';
        });

        i = 0;
        node.select('image').transition().duration(updateTransitionDuration).delay(function (d) {
            return i++ * updateTransitionDelay;
        }).ease(d3.easeBounce).attr('x', function (d) {
            return -d.r;
        }).attr('y', function (d) {
            return -d.r;
        }).attr('width', function (d) {
            return d.r * 2;
        }).attr('height', function (d) {
            return d.r * 2;
        });

        i = 0;
        node.select('circle').transition().duration(updateTransitionDuration).delay(function (d) {
            return i++ * updateTransitionDelay;
        }).ease(d3.easeBounce).attr('r', function (d) {
            return d.r;
        });

        i = 0;
        node.select('text').transition().duration(updateTransitionDuration).delay(function (d) {
            return i++ * updateTransitionDelay;
        }).attr('textLength', function (d) {
            return d.r * 1.6;
        }).style('font-size', function (d) {
            return d.r * 0.9 - d.r * 0.8 * Math.min(24, d.data.name.length) / 24 + 'px';
        });

        node.exit().remove();
    }

    function resetBubbles() {
        svg.selectAll('.node').remove();
    }

    function updateRandomBubbles() {
        companiesBubbles.update('random1', Math.random() * 18 + 1).update('random2', Math.random() * 18 + 1).play();
    }

    function shuffle(a) {
        for (var i = a.length; i; i--) {
            var j = Math.floor(Math.random() * i);
            var _ref = [a[j], a[i - 1]];
            a[i - 1] = _ref[0];
            a[j] = _ref[1];
        }
    }
});

