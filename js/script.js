


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
        	d3.select("#applyFilterButton").on('click',applyFilter);
        	addFilters();

        	let table = new Table(csvData);
        	table.createTable();

        	// update elements, calcualte links and sort
        	table.updateTable();

        	// update to current game data
			function onchange() {
				table.updateTable();
			};    	

			function applyFilter(){
    			console.log('filter');
    			let a = d3.select('#multi-menu-lang')
    			.selectAll("option")
    			.filter(function (d, i) { 
    			    return this.selected; 
    			});
    			table.controllerFilter = false;
    			if(d3.select('#boxCtnlr').node().checked == true) table.controllerFilter = true;

    			table.platformFilter = false;
    			table.platformFilterArray = [false,false, false];
    			//console.log("sel:"+d3.select('#boxLinux').node().selected);

    			if(d3.select('#boxWindows').node().selected == true) {table.platformFilter = true; table.platformFilterArray[0]=true;}
    			if(d3.select('#boxLinux').node().selected == true) {table.platformFilter = true; table.platformFilterArray[1]=true;}
    			if(d3.select('#boxMac').node().selected == true) {table.platformFilter = true; table.platformFilterArray[2]=true;}

    			let genreFilters =  [
        		'-- Genre --',
        		'NonGame','Indie','Action','Adventure','Casual',
        		'Strategy', 'RPG','Simulation','EarlyAccess','FreeToPlay',
        		'Sports','Racing','MassivelyMultiplayer'];
    			table.genreFilter = false;
    			table.genreFilterArray = [false,false,false,false,false, false,false,false,false,false, 
                                false,false,false]
    			for (var i = 1; i < genreFilters.length; i++) {
    				if(d3.select("#box"+genreFilters[i]).node().selected){
    					table.genreFilter = true;
    					table.genreFilterArray[i-1] = true;
    				}
    			}

    			console.log(a);
    			table.updateTable();
			};




			d3.json('data/network.json').then(networkData=>{
            	let network = new Network(networkData);
            	network.createNetwork();
			})



    });



    function addFilters(){
    	let genreFilters =  [
        	'-- Genre --',
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


