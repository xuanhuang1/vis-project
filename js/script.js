


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
        	addFilters();

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



    function addFilters(){
    	let genreFilters =  [
        	'-- Genre --',
        	'SinglePlayer', 'Multiplayer', 'Coop','MMO','InAppPurchase',
        	'IncludeSrcSDK','IncludeLevelEditor','VRSupport',
        	'NonGame','Indie','Action','Adventure','Casual',
        	'Strategy', 'RPG','Simulation','EarlyAccess','FreeToPlay',
        	'Sports','Racing','MassivelyMultiplayer'];
        	d3.select("#multi-menu-genre")
        		.selectAll('option')
        		.data(genreFilters)
        		.enter()
        		.append('option').attr('id',d=>('box'+d))
        		.text(d=>d);

        let langFilters =  [
        	'-- Language --',
        	'English', 'Czech', 'Danish','German','Spanish',
        	'Finnish','French','Italian',
        	'Hungarian','Dutch','Norwegian','Polish','Russian',
        	'Swedish', 'Portuguese','Korean','PortugueseBrazil','Romanian',
        	'Simplified Chinese','Traditional Chinese','Thai'];
        	d3.select("#multi-menu-lang")
        		.selectAll('option')
        		.data(langFilters)
        		.enter()
        		.append('option').attr('id',d=>('box'+d))
        		.text(d=>d);

        let svg = d3.select("#filter-svg");
    	let priceGroup = svg.append('g');
        priceGroup.append('text').text('Price:').attr('x',0).attr('y',20);
        priceGroup.append('foreignObject')
        .attr('x',0).attr('y',20)
        .attr('width',50).attr('height',20)

   
    }


