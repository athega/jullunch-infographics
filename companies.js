$(function() {
    'use strict';

    const diameter = 640,
        transitionDuration = 6000;

    const color = d3.scale.category20c();
    //const color = d3.scale.linear().domain([1,40])
    //    .interpolate(d3.interpolateHcl)
    //    .range([d3.rgb("#FF2000"), d3.rgb('#BF6000')]);

    const svg = d3.select('#companies').append('svg')
        .attr('viewBox', '0 0 ' + diameter + ' ' + diameter)
        .attr('width', diameter)
        .attr('height', diameter);

    const bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, diameter])
        .padding(1.5);

    let arrivals = {};

    window.companiesBubbles = {
        update: function(name, arrived) {
            // Reveived updated data event, but page may not be visible.
            arrivals[name] = arrived;
            updateBubbles();
        },
        pause: function() {
            // Companies page not visible.
        },
        play: function() {
            // Companies page is shown, run animations.
        }
    };

    function d3data(arrivals) {
        return {
            children: Object.keys(arrivals).map((company) => {
                return {key: company, value: arrivals[company]};
            })
        };
    }

    function updateBubbles() {
        const data = d3data(arrivals);

        if (!data || !data.children.length) {
            console.log('No data, bailing out');
            return;
        }
        var node = svg.selectAll('.node')
            .data(bubble.nodes(data).filter((d) => !d.children));

        // capture the enter selection
        var nodeEnter = node.enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

        // re-use enter selection for circles
        nodeEnter
            .append('circle')
            .attr('r',  (d)  => d.r )
            .style('fill', (d) => color(d.key));

        // re-use enter selection for titles
        nodeEnter.append('text')
            .attr('dy', '.3em')
            .style('text-anchor', 'middle')
            //.style('font-size', function(d) { return Math.min(2 * d.r, (2 * d.r - 8) / this.getComputedTextLength() * 24) + "px"; })
            .text((d) => d.key);

        node.select('circle')

            .transition().duration(transitionDuration)
            .attr('r', (d) => d.r)
            .style('fill', (d) => color(d.key));

        node.transition().duration(transitionDuration)
            .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');

        node.exit().remove();

        //d3.select(self.frameElement).style('height', diameter + 'px');
    }

});
