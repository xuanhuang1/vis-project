


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
        //console.log(csvData);
        d3.csv("data/steam-200k-test.csv").then(userData => {
			//console.log(userData);
			let l = 0, p =0;
			csvData.forEach( (d, i) => {
            	let a = userData.filter(function (k){
            		 if ((k.Name == d.QueryName) || (k.Name == d.ResponseName)){
                         d.QueryName = k.Name;
                         d.ResponseName = k.Name;
                         l++;
                         //console.log(d.	QueryName);
                         return true;
            		 }
            	});
            	if(a.length > 0){
            		//console.log(a);
            		p++;
            	}
            	d.buyers = a;
        	});
        	console.log("user data matched:",l);
        	console.log("game data matched:",p);

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




    });


