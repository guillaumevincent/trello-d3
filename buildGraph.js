function buildD3Graph(cards) {
    var sourcesIds = {};
    cards.forEach(card => {
        var source = {id: card.id, name: card.name};
        sourcesIds[window.btoa(card.url)] = source;
        sourcesIds[window.btoa(card.shortUrl)] = source;
        sourcesIds[card.id] = source;
        sourcesIds[card.shortLink] = source;
    });
    function getLinks(string) {
        var matches = [];
        var parentRegex = /^.*Link\s*:\s*(\S+)/mgi;
        var match = parentRegex.exec(string);
        while (match !== null) {
            matches.push(match[1]);
            match = parentRegex.exec(string);
        }
        return matches;
    }

    var links = [];
    cards.forEach(card => {
        var ls = getLinks(card.desc);
        ls.forEach(l => {
            var source = sourcesIds[window.btoa(l)];
            if (typeof source !== 'undefined') {
                links.push({source: source.id, target: card.id, sourceName: source.name, targetName: card.name})
            }
        });
    });
    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] || (nodes[link.source] = {name: link.sourceName});
        link.target = nodes[link.target] || (nodes[link.target] = {name: link.targetName});
    });

    var margin = {top: 50, right: 10, bottom: 10, left: 10};
    var width = window.innerWidth - margin.left - margin.right;
    var height = window.innerHeight - margin.top - margin.bottom;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(120)
        .charge(-500)
        .on("tick", tick)
        .start();

    var svg = d3.select("svg")
        .attr("class", "svg svg--bordered")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(50,0)");

    var path = svg.append("g").selectAll("path")
        .data(force.links())
        .enter().append("path")
        .attr("class", "link");


    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
        .enter().append("circle")
        .attr("r", 6)
        .call(force.drag);

    var text = svg.append("g").selectAll("text")
        .data(force.nodes())
        .enter().append("text")
        .attr("x", 8)
        .attr("y", ".31em")
        .text(function(d) {
            return d.name;
        });

    function tick() {
        path.attr("d", linkArc);
        circle.attr("transform", transform);
        text.attr("transform", transform);
    }

    function linkArc(d) {
        var dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);
        return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
    }

    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }
}