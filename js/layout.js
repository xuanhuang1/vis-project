/** Class implementing the tree view. */
class Network {
    /**
     * Creates a Tree Object
     */
    constructor(data) {
        this.data =data;
        this.height = 600;
        this.width = 600;
        this.simulation=null;
        this.svg = d3.select('#layout');
        this.links = null;
        this.nodes = null;
        this.labels = null;
    }

    updateNetwork(tableElements, gameSelected){
        let tempidList = tableElements.map(d=>d.Index)

        let maxNeighborCounts = d3.max(tableElements.map(d=>Object.keys(d.neighborList).length))

        let idList = new Set(tempidList)
        let that = this;
      //  let linksList = this.data.links.map(function(d){
        //    if (idList.has(d.source) & idList.has(d.target)){
          //      return Object.create(d)}});
        let tempLinksList = Object.keys(gameSelected.neighborList)
        console.log(tempLinksList)
        let linksList = tempLinksList.map(function(d){
            if (idList.has(d)){
                let newlink = {source: gameSelected.Index,target:d}
                return Object.create(newlink)
            }
        })
        let nodesList = tableElements.map(function(d) {
            let newNode = Object.create(d)
            newNode.id = newNode.Index
            return newNode}
        );
        linksList = linksList.filter(n=>n);
        nodesList = nodesList.filter(n=>n);
        console.log(nodesList)
        this.links = this.svg.select('.linkGroup')
            .selectAll("line")
            .data(linksList);
        this.links.exit().remove();
        this.links = this.links.enter().append("line").merge(this.links);
        this.links.attr("stroke-width", 2)
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.4);

        this.nodes = this.svg.select('.nodeGroup')
            .selectAll('circle')
            .data(nodesList);
        this.nodes.exit().remove();
        this.nodes = this.nodes.enter().append('circle').merge(this.nodes);
        this.nodes.attr("stroke", "#fff")
            .attr("stroke-width", 1.5)
            .attr("r", function(d){
                  let entry = tableElements.find(e=>e.Index===d.id)
                    return 10*Object.keys(entry.neighborList).length/maxNeighborCounts
                    })
            .attr("fill", 'black');

        this.labels = this.svg.select('.nodeGroup')
            .selectAll('text')
            .data(nodesList);
        this.labels.exit().remove();
        this.labels = this.labels.enter().append('text').merge(this.labels)
        this.labels.text(d=>d.QueryName)
            .attr('fill','black');

        function box_force() {
            for (var i = 0, n = nodesList.length; i < n; ++i) {
                let curr_node = nodesList[i];
                curr_node.x = Math.max(radius, Math.min(this.width - radius, curr_node.x));
                curr_node.y = Math.max(radius, Math.min(height - radius, curr_node.y));
            }
        }


        this.simulation = d3.forceSimulation(nodesList)
            .force('link',d3.forceLink(linksList).id(d=>d.id))
            .force('charge',d3.forceManyBody().strength(-1000))
            .force('center',d3.forceCenter())
            .force('collide',d3.forceCollide().radius(40).iterations(20))
            .stop();

        d3.timeout(function(){
            for (var i = 0, n = Math.ceil(Math.log(that.simulation.alphaMin()) / Math.log(1 - that.simulation.alphaDecay())); i < n; ++i) {
                that.simulation.tick();}
            that.links
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y)
                .attr('transform','translate(' + that.width/2 + ',' +  that.height/2 + ')' );

            that.nodes
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr('transform','translate(' + that.width/2 + ',' +  that.height/2 + ')' );

            that.labels
                .attr('x', d=>d.x+10)
                .attr('y',d=>d.y)
                .attr('font','8px')
                .attr('transform','translate(' + that.width/2 + ',' +  that.height/2 + ')' );
        })
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createNetwork() {

        this.svg.append("g")
            .classed('linkGroup',true);


        this.svg.append("g")
            .classed('nodeGroup',true);




        }


}
