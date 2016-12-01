$(function() {
    'use strict';

    const $page = $('main > #companies'),
        diameter = 640,
        initialTransitionDuration = 12000,
        initialTransitionDelay = 2000,
        updateTransitionDuration = 4000,
        updateTransitionDelay = 400,
        randomBubblesInterval = 14000,
        color = d3.scaleOrdinal(d3.schemeCategory10),
        svg = d3.select('#companies')
            .append('svg')
            .attr('viewBox', '0 0 ' + diameter + ' ' + diameter)
            .attr('width', diameter)
            .attr('height', diameter),
        pack = d3.pack().size([diameter, diameter]),
        data = {
            children: [],
            companies: {},
        },
        actions = {
            update: function(event, name, count) {
               if (data.companies[name]) {
                   data.companies[name].size = count;
               } else {
                   data.children.push(data.companies[name] = {name: name, size: count || 1});
               }
               return this;
            },
            pause: function(event) {
                clearInterval(updateRandomBubbles.interval);
                updateRandomBubbles.interval = false;
                resetBubbles();
                updateBubbles.playing = false;
                return this;
            },
            play: function(event) {
                if (!updateRandomBubbles.interval) {
                    updateRandomBubbles();
                    updateRandomBubbles.interval = setInterval(updateRandomBubbles, randomBubblesInterval);
                }

                if (!updateBubbles.playing) {
                    shuffle(data.children);
                }

                updateBubbles();
                updateBubbles.playing = true;
                return this;
            },
        };

    $page.on(actions);

    function updateBubbles() {
        const root = d3.hierarchy(data).sum(d => d.size),
            node = svg.selectAll('.node').data(pack(root).leaves());

        // New nodes
        const g1 = node.enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => 'translate(' + diameter/2 + ',' + diameter/2 + ') scale(0)')
            .style('display', d => d.data.name == 'random1' || d.data.name == 'random2' ? 'none' : 'inline-block');

        let i = 0;
        g1.transition()
            .duration(initialTransitionDuration)
            .delay(d => i++ * initialTransitionDelay)
            .ease(d3.easeBounce)
            .attr('transform', d => 'translate(0,0) scale(1)');

        const g2 = g1.append('g')
            .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')')

        g2.append('image')
            .attr('xlink:href', 'images/bubble-background.png')
            .attr('x', d => -d.r)
            .attr('y', d => -d.r)
            .attr('width', d => d.r * 2)
            .attr('height', d => d.r * 2);

        const blendModes = ['color', 'color-burn', 'color-dodge', 'hard-light', 'multiply', 'overlay', 'screen', 'soft-light'];
        g2.append('circle')
            .attr('r', d => d.r)
            .style('mix-blend-mode', d => blendModes[Math.floor(Math.random()*blendModes.length)])
            .style('fill', d => color(Math.random()));

        g2.append('text')
            .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            .attr('lengthAdjust', 'spacingAndGlyphs')
            .attr('textLength', d => d.r * 1.6)
            .style('font-size', d => (d.r*0.9 - d.r*0.8 * Math.min(24, d.data.name.length)/24 ) + 'px')
            .text(d => d.data.name);

        // Updates
        i = 0;
        node.select('g')
            .transition()
            .duration(updateTransitionDuration)
            .delay(d => i++ * updateTransitionDelay)
            .ease(d3.easeBounce)
            .attr('transform', d => 'translate(' + d.x + ',' + d.y + ') scale(1)');

        i = 0;
        node.select('image')
            .transition()
            .duration(updateTransitionDuration)
            .delay(d => i++ * updateTransitionDelay)
            .ease(d3.easeBounce)
            .attr('x', d => -d.r)
            .attr('y', d => -d.r)
            .attr('width', d => d.r * 2)
            .attr('height', d => d.r * 2);

        i = 0;
        node.select('circle')
            .transition()
            .duration(updateTransitionDuration)
            .delay(d => i++ * updateTransitionDelay)
            .ease(d3.easeBounce)
            .attr('r', d => d.r);

        i = 0;
        node.select('text')
            .transition()
            .duration(updateTransitionDuration)
            .delay(d => i++ * updateTransitionDelay)
            .attr('textLength', d => d.r * 1.6)
            .style('font-size', d => (d.r*0.9 - d.r*0.8 * Math.min(24, d.data.name.length)/24 ) + 'px');

        node.exit().remove();
    }

    function resetBubbles() {
        svg.selectAll('.node').remove();
    }

    function updateRandomBubbles() {
        actions.update(undefined, 'random1', Math.random() * 18 + 1)
               .update(undefined, 'random2', Math.random() * 18 + 1);

        if (updateRandomBubbles.interval)
            actions.play();
    }

    function shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
});
