/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {

    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******


        //Create a tree and give it a size() of 800 by 300. (svg 500 x 900)
        let margin = {'top': 50, 'right': 100, 'bottom': 50, 'left': 100};
        let height = 500 - margin.left - margin.right;
        let width = 900 - margin.top - margin.bottom;

        let the_tree_group = d3.select('#tree')
            .attr("transform", "translate("
            + margin.left + "," + margin.top + ")")

        let treemap = d3.tree().size([width, height]);
        //console.log(treeData);

        //Create a root for the tree using d3.stratify();
        let root = d3.stratify()
            .id(d => { return d.id; })
            .parentId(d => {
                if(d.ParentGame == '') return null;
                return treeData[d.ParentGame].id;
            })
            (treeData);

        //Add nodes and links to the tree.
        root.x = height/2;
        root.y = 0;

        let theTreeDataSruct = treemap(root);
        let nodes = theTreeDataSruct.descendants(),
            links = theTreeDataSruct.descendants().slice(1);

        let theGroup = the_tree_group.selectAll('g')
            .data(nodes)
            .enter();


        function diagonal(s, d) {
            return `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`
        }

        theGroup.append('g')
            .attr('class','link')
            .append('path')
            .attr('d', d => {
                if(d.parent == null) return;
                return diagonal(d, d.parent)
            });

        let nodeGroup = theGroup.append('g')
            .attr("transform", d => "translate(" + d.y + "," + d.x + ")")
            .attr('class',function(d){
                if(d.data.Wins == 1) return'node winner';
                return 'node loser'
                })

        nodeGroup.append('circle')
            .attr('r', 6)
        nodeGroup.append('text')
            .attr("dy", ".35em")
            .attr("dx", ".5em")
            //.attr('x', -10)
            //.attr('y', )
            .text(d=>d.data.Team);


    }

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******

        let links = d3.select('#tree').selectAll('.link');
        let nodes = d3.select('#tree').selectAll('text');
        if(row.value.type == 'aggregate' ){
            links.each(function(x){
                if(x.data.Team == row.key) d3.select(this).classed('selected', true);
            });
            nodes.each(function(x){
                if(x.data.Team == row.key) d3.select(this).classed('selectedLabel', true);
            });
        }else if(row.value.type == 'game' ){
            links.each(function(x){
                if(((x.data.Team == row.key) && (x.data.Opponent == row.value.Opponent)) ||
                    ((x.data.Team == row.value.Opponent) && (x.data.Opponent == row.key)))
                    d3.select(this).classed('selected', true);
            });
            nodes.each(function(x){
                if(((x.data.Team == row.key) && (x.data.Opponent == row.value.Opponent)) ||
                    ((x.data.Team == row.value.Opponent) && (x.data.Opponent == row.key)))
                    d3.select(this).classed('selectedLabel', true);
            });
        }else{console.log('What did you hover on? should be a agg or game row');}
    
    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******
        d3.select('#tree').selectAll('.link').classed('selected', false);
        d3.select('#tree').selectAll('text').classed('selectedLabel', false);
        // You only need two lines of code for this! No loops!
    }
}
