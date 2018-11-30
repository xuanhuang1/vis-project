/** Class implementing the tree view. */
class Network {
    /**
     * Creates a Tree Object
     */
    constructor(table) {
        this.height = 600;
        this.width = 600;
        this.max_radius = 20;
        this.simulation=null;
        this.svg = d3.select('#layout');
        this.links = null;
        this.nodes = null;
        this.table = table
    }

    updateNetwork(tableElements, gameSelected,edgeList){
        let tempidList = tableElements.map(d=>d.Index)

        let edgeDegree = d3.max(edgeList.map(d=>d[1]))
        console.log(edgeDegree)
        let idList = new Set(tempidList)
        let that = this;
      //  let linksList = this.data.links.map(function(d){
        //    if (idList.has(d.source) & idList.has(d.target)){
          //      return Object.create(d)}});
        let tempLinksList = Object.keys(gameSelected.neighborList);
        let edgeMap = {}
        let linksList = tempLinksList.map(function(d){
            if (idList.has(d) & d!=gameSelected.Index){
                for (let i = 0; i < edgeList.length;i++){
                    if (edgeList[i][0]===parseInt(d)){
                        let newlink = {source: gameSelected.Index,target:d, value:edgeList[i][1]}
                        edgeMap[d] = edgeList[i][1]
                        return Object.create(newlink)
                    }
                }

            }
        });
        let nodesList = tableElements.map(function(d) {
            let newNode = Object.create(d)
            newNode.id = newNode.Index
            return newNode}
        );
        linksList = linksList.filter(n=>n);
        nodesList = nodesList.filter(n=>n);
        console.log(edgeMap)
        this.links = this.svg.select('.linkGroup')
            .selectAll("line")
            .data(linksList);
        this.links.exit().remove();
        this.links = this.links.enter().append("line").merge(this.links);
        this.links.attr("stroke-width", 2)
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.4);

        this.nodes = this.svg.select('.nodeGroup')
            .selectAll('g')
            .data(nodesList);
        this.nodes.exit().remove();
        this.nodes = this.nodes.enter().append('g').merge(this.nodes);


        // this.labels = this.svg.select('.nodeGroup')
        //     .selectAll('text')
        //     .data(nodesList);
        // this.labels.exit().remove();
        // this.labels = this.labels.enter().append('text').merge(this.labels)
        // this.labels.text(d=>d.QueryName)
        //     .attr('fill','black');



        this.simulation = d3.forceSimulation(nodesList)
            .force('link',d3.forceLink(linksList).id(d=>d.id))
            .force('charge',d3.forceManyBody().strength(-100))
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

            that.nodes.selectAll('circle').remove();
            that.nodes.selectAll('text').remove();
            that.nodes.append('circle')
                .classed('unselected',true)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0)
                .attr('fill',d=>(d.Index===gameSelected.Index?'#42c2f4':'#153363') )
                .attr("r", d=>(d.Index===gameSelected.Index?that.max_radius: that.max_radius*edgeMap[parseInt(d.Index)]/edgeDegree))
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr('transform','translate(' + that.width/2 + ',' +  that.height/2 + ')' );

            that.nodes.append('text')
                .attr('x', d=>d.x+12)
                .attr('y',d=>d.y-20)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0)
                .attr('fill', '#153363')
                .attr('font-size', '8px')
                .text(d=>d.QueryName)
                .classed('unselected',true)
                .attr('text-anchor','middle')
                .attr('transform','translate(' + that.width/2 + ',' +  that.height/2 + ')' );

            that.nodes.on('mouseover',function(d){
                 d3.select(this).select('circle')
                    .classed('unselected',false)
                    .classed('selected',true)
                    .attr('fill','#ba375e');
                 d3.select(this).select('text')
                    .classed('unselected',false)
                    .classed('selected',true)
                    .attr('fill','#ba375e')
                    .attr('font-size','16px');

                 d3.selectAll('.unselected')
                    .attr('opacity','0.5')

                that.table.setHighLight(d.Index)
                })
                .on('mouseout',function(){
                    d3.select(this).select('circle')
                      .classed('unselected',true)
                      .classed('selected',false)
                      .attr('fill',d=>(d.Index===gameSelected.Index?'#42c2f4':'#153363') );

                    d3.select(this).select('text')
                      .classed('unselected',true)
                      .classed('selected',false)
                      .attr('fill',d=>(d.Index===gameSelected.Index?'#42c2f4':'#153363') )
                      .attr('font-size','8px');

                    d3.selectAll('.unselected').attr('opacity','1');
                    that.table.clearHighLight();
                })
                .on('click',function(d){
                    //tell the table to update with new index

                });
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
