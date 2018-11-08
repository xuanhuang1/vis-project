

    d3.csv("data/games-features-test.csv").then(csvData => {

        /*//Create a unique "id" field for each game
        csvData.forEach( (d, i) => {
            d.id = d.Team + d.Opponent + i;
        });

        //Create Tree Object
        let tree = new Tree();
        tree.createTree(csvData);

        //Create Table Object and pass in reference to tree object (for hover linking)

        let table = new Table(data,tree);

        table.createTable();
        table.updateTable();*/
        console.log(csvData);
        d3.csv("data/steam-200k-test.csv").then(userData => {
			console.log(userData);
			let l = 0, p =0;
			csvData.forEach( (d, i) => {
            	let a = userData.filter(function (k){
            		 if ((k.Name == d.QueryName) || (k.Name == d.ResponseName)){
                         d.QueryName = k.Name;
                         d.ResponseName = k.Name;
                         l++;
                         return true;
            		 }
            	});
            	if(a.length > 0){
            		//console.log(a);
            		p++;
            	}
            	d['buyers'] = a;
        	});
        	console.log("user data matched:",l);
        	console.log("game data matched:",p);
        	
    	});
		//console.log(csvData);


        let selector = d3.select("#dropdown")
        .append("select")
        .attr("id", "gameselector")
        .selectAll("option")
        .data(csvData)
        .enter().append("option")
        .text(function(d) { return d.QueryName; });

        let table = new Table(csvData);
        table.createTable();
        table.updateTable();

    });



// // ********************** HACKER VERSION ***************************
/**
 * Loads in fifa-matches-2018.csv file, aggregates the data into the correct format,
 * then calls the appropriate functions to create and populate the table.
 *
 */

// d3.csv("data/fifa-matches-2018.csv").then( matchesCSV => {

//     /**
//      * Loads in the tree information from fifa-tree-2018.csv and calls createTree(csvData) to render the tree.
//      *
//      */
//    d3.csv("data/fifa-tree-2018.csv").then( treeCSV => {

//     // ******* TODO: PART I *******


//       });

// });
// ********************** END HACKER VERSION ***************************
