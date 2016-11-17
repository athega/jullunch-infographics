$(function() {
    'use strict';

    const diameter = 640,
        initialTransitionDuration = 12000,
        initialTransitionDelay = 2000,
        updateTransitionDuration = 800,
        updateTransitionDelay = 200;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select('#companies').append('svg')
        .attr('viewBox', '0 0 ' + diameter + ' ' + diameter)
        .attr('width', diameter)
        .attr('height', diameter);

    const pack = d3.pack()
        .size([diameter, diameter]);

    let data = {
        children: [],
        companies: {},
    };

    window.companiesBubbles = {
        update: function(name, arrived) {
           if (data.companies[name]) {
               data.companies[name].size = arrived;
           } else {
               data.children.push(data.companies[name] = {name: name, size: Math.random() * 12 + 1}); // TODO: Change random size to: arrived
           }
        },
        pause: function() {
            resetBubbles();
        },
        play: function() {
            updateBubbles();
        },
    };

    function updateBubbles() {
        var root = d3.hierarchy(data)
            .sum((d) => d.size);

        var node = svg.selectAll('.node')
            .data(pack(root).leaves());

        // New nodes
        var g1 = node.enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', (d) => 'translate(' + diameter/2 + ',' + diameter/2 + ') scale(0)');

        var i = 0;
        g1.transition()
            .duration(initialTransitionDuration)
            .delay((d) => i++ * initialTransitionDelay)
            .ease(d3.easeBounce)
            .attr('transform', (d) => 'translate(0,0) scale(1)');

        var g2 = g1.append('g')
            .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')')

        g2.append('image')
            .attr('xlink:href', 'images/bubble-background.png')
            .attr('x', (d) => -d.r)
            .attr('y', (d) => -d.r)
            .attr('width', (d) => d.r*2)
            .attr('height', (d) => d.r*2);

        g2.append('circle')
            .attr('r',  (d)  => d.r)
            .style('opacity', 0.3)
            .style('fill', (d) => color(d.data.name));

        g2.append('text')
            .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            .attr('lengthAdjust', 'spacingAndGlyphs')
            .attr('textLength', (d) => d.r * 1.6)
            .style('font-size', (d) => (d.r*0.9 - d.r*0.8 * Math.min(24, d.data.name.length)/24 ) + 'px')
            .text((d) => d.data.name);

        // Updates
        var i = 0;
        node.select('g')
            .transition()
            .duration(updateTransitionDuration)
            .delay((d) => i++ * updateTransitionDelay)
            .ease(d3.easeBounce)
            .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ') scale(1)');

        var i = 0;
        node.select('image')
            .transition()
            .duration(updateTransitionDuration)
            .delay((d) => i++ * updateTransitionDelay)
            .ease(d3.easeBounce)
            .attr('x', (d) => -d.r)
            .attr('y', (d) => -d.r)
            .attr('width', (d) => d.r*2)
            .attr('height', (d) => d.r*2);

        var i = 0;
        node.select('circle')
            .transition()
            .duration(updateTransitionDuration)
            .delay((d) => i++ * updateTransitionDelay)
            .ease(d3.easeBounce)
            .attr('r', (d) => d.r);

        var i = 0;
        node.select('text')
            .transition()
            .duration(updateTransitionDuration)
            .delay((d) => i++ * updateTransitionDelay)
            .attr('textLength', (d) => d.r * 1.6)
            .style('font-size', (d) => (d.r*0.9 - d.r*0.8 * Math.min(24, d.data.name.length)/24 ) + 'px');

        node.exit().remove();
    }

    function resetBubbles() {
        svg.selectAll('.node').remove();
    }

});
