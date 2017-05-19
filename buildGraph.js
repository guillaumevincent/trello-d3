function buildD3Graph(links) {
    var width = 1400,
        height = 1000;

    var stratify = d3.stratify()
        .id(function(d) {
            return d.source;
        })
        .parentId(function(d) {
            return d.target;
        })(links);

    const svg = d3.select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(100,0)");

    const root = d3.hierarchy(stratify);
    const tree = d3.tree().size([height - 100, width - 500]);

    tree(root);

    // Normalize for fixed-depth.
    root.descendants().forEach(function(d) {
        d.y = d.depth * 250
    });

    var link = svg.selectAll(".link")
        .data(root.descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x
                + "C" + (d.parent.y + 100) + "," + d.x
                + " " + (d.parent.y + 100) + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
        });

    var node = svg.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function(d) {
            return "node" + (d.children ? " node--internal" : " node--leaf");
        })
        .attr("transform", function(d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    node.append("circle")
        .attr("r", 2.5);

    node.append("text")
        .attr("dy", 3)
        .attr("x", function(d) {
            return d.children ? 0 : 8;
        })
        .attr("y", function(d) {
            return d.children ? -8 : 0;
        })
        .style("text-anchor", function(d) {
            return d.children ? "end" : "start";
        })
        .text(function(d) {
            return d.data.id
        });
}