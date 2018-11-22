


    d3.csv("data/game-features.csv").then(csvData => {

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
        //console.log(csvData);


        	// set selector and change function
        	let selector = d3.select("#dropdown")
        		.append("select")
        		.attr("id", "gameselector")
        		.selectAll("option")
        		.data(csvData)
       	 		.enter().append("option")
        		.text(function(d) { return d.QueryName; })
        	d3.select("#gameselector").on('change',onchange);

        	let table = new Table(csvData);
        	table.createTable();

        	// update elements, calcualte links and sort
        	table.updateTable();


			d3.json('data/network.json').then(networkData=>{
            	let network = new Network(networkData);
            	network.createNetwork();
			})

        	// update to current game data
			function onchange() {
				table.updateTable();
			};    	




    });


