/** Class implementing the tree view. */
class Network {
    /**
     * Creates a Tree Object
     */
    constructor(data) {
        this.data =data;
        this.height = 600;
        this.width = 500;
        this.node=null;
        this.link=null;
        this.simulation=null;
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createNetwork() {
        let that = this;
        let links = this.data.links.map(d => Object.create(d));
        let nodes = this.data.nodes.map(d => Object.create(d));


        let svg = d3.select('#layout');


        this.link = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", 2);

        this.node = svg.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
            .attr("r", 5)
            .attr("fill", 'black');

        this.node.append("title")
            .text(d => d.id);
        this.simulation = d3.forceSimulation(nodes)
            .force('link',d3.forceLink(links).id(d=>d.id))
            .force('charge',d3.forceManyBody().strength(-1000))
            .force('center',d3.forceCenter())
            .force('collide',d3.forceCollide().radius(5).iterations(10))
            .stop();

        d3.timeout(function(){
              for (var i = 0, n = Math.ceil(Math.log(that.simulation.alphaMin()) / Math.log(1 - that.simulation.alphaDecay())); i < n; ++i) {
                    that.simulation.tick();}
              that.link
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)
                    .attr('transform','translate(' + that.width/2 + ',' +  that.height/2 + ')' );;

                that.node
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                  .attr('transform','translate(' + that.width/2 + ',' +  that.height/2 + ')' );;
        })

        }


}
