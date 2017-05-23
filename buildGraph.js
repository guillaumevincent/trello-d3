function buildD3Graph(links) {
    var margin = {top: 20, right: 50, bottom: 20, left: 50},
        width = document.getElementById('svg').offsetWidth - 20 - margin.left - margin.right,
        height = document.getElementById('svg').offsetHeight - 20 - margin.top - margin.bottom;

    var stratify = d3.stratify()
        .id(function(d) {
            return d.source;
        })
        .parentId(function(d) {
            return d.target;
        })(links);

    const svg = d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const root = d3.hierarchy(stratify);
    const tree = d3.tree().size([height, width]);

    tree(root);

    const getDepth = ({ children }) => 1 + (children ? Math.max(...children.map(getDepth)) : 0);
    const maxDepth = getDepth(root);

    // Normalize for fixed-depth.
    root.descendants().forEach(function(d) {
        d.y = d.depth * Math.round(width / maxDepth)
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
            return d.children ? d.data.id.length * 3 : 8;
        })
        .attr("y", function(d) {
            return d.children ? -8 : 0;
        })
        .style("text-anchor", function(d) {
            return d.children ? "end" : "start";
        })
        .on("dblclick", function(d) {
            var url = d.data.data.url;
            if (typeof url !== 'undefined') {
                window.open(url, '_blank');
            }
        })
        .text(function(d) {
            return d.data.id
        });
}
