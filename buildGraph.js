function buildD3Graph(cards) {
    function getLink(string) {
        var matches = [];
        var parentRegex = /^.*Link\s*:\s*(\S+)/mgi;
        var match = parentRegex.exec(string);
        while (match !== null) {
            matches.push(match[1]);
            match = parentRegex.exec(string);
        }
        return matches;
    }

    function getColor(card) {
        var labels = card.labels || [];
        if (labels.length > 0) {
            var isBlocked = false;
            labels.forEach(label => {
                if (['block', 'blocked'].indexOf(label.name.toLowerCase()) !== -1) {
                    isBlocked = true;
                }
            });
            return isBlocked ? 'red' : labels[0].color;
        }
        return '#c6dbef'
    }

    function getName(card) {
        var labels = card.labels || [];
        if (labels.length > 0) {
            var isBlocked = false;
            labels.forEach(label => {
                if (['block', 'blocked'].indexOf(label.name.toLowerCase()) !== -1) {
                    isBlocked = true;
                }
            });
            return isBlocked ? '' : labels[0].name;
        }
        return '';
    }

    var dataSourcesIds = {};
    cards.forEach(card => {
        dataSourcesIds[window.btoa(card.url)] = card.id;
        dataSourcesIds[window.btoa(card.shortUrl)] = card.id;
        dataSourcesIds[card.id] = card.id;
        dataSourcesIds[card.shortLink] = card.id;
    });

    var nodes = [];
    var links = [];
    cards.forEach(card => {
        var n = {id: card.id, url: card.url, children: true, radius: 5, name: card.name};
        var ls = getLink(card.desc);
        ls.forEach(l => {
            links.push({source: dataSourcesIds[window.btoa(l)], target: card.id, value: 1})
        });
        if (ls.length === 0) {
            n.radius = 10;
            n.name = getName(card);
        }
        n.color = getColor(card);
        nodes.push(n);
    });

    d3.selectAll("svg > *").remove();

    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {
            return d.id;
        }).distance(100))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", function(d) {
            return Math.sqrt(d.value);
        });

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("dblclick", function(d) {
            window.open(d.url, '_blank');
        })
        .call(d3.drag().on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var circle = node.append("circle")
        .attr("r", function(d) {
            return d.radius;
        })
        .attr("fill", function(d) {
            return d.color;
        });

    circle.append("title")
        .text(function(d) {
            return `${d.name}`;
        });


    var text = node.append("text")
        .text(function(d) {
            return d.name;
        });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function ticked() {
        link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        circle
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });

        text
            .attr("dx", function(d) {
                return d.x + 15;
            })
            .attr("dy", function(d) {
                return d.y + 4;
            });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}