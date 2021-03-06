



async function tableCreation(){
	let csvData = await d3.csv('data/game-features.csv')
	let dropdownArray = csvData.map(d=>d.QueryName);
	dropdownArray.sort();
    let selector = d3.select("#dropdown")
        .append("select")
        .attr("id", "gameselector")
        .selectAll("option")
        .data(dropdownArray)
        .enter().append("option")
        .text(function(d) { return d; })
    d3.select("#gameselector").on('change',onchange);
    d3.select("#applyFilterButton").on('click',applyFilter);
    d3.select("#clearFilterButton").on('click',clearFilter);

    addFilters();
    let table = new Table(csvData);
	let network = new Network(table);
	let infobox = new InfoBox();
	network.createNetwork();
	infobox.createInfoBox();
	table.assignNetworkandInfoBox(network,infobox);
    table.createTable();

		let s = document.getElementById('gameselector');
		for ( var i = 0; i < s.options.length; i++ ) {
				if ( s.options[i].text == "The Elder Scrolls V Skyrim" ) {
						s.options[i].selected = true;
						break;
				}
		}
    // update elements, calcualte links and sort
    table.updateTable();

    // use table.setHighLight(index) to set hightlight
    // use table.clearHighLight() to clean all highlights

    function onchange() {
        table.updateTable();
    }

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

        let langFilters =  [
            '-- Language --',
            'English', 'Czech', 'Danish','German','Spanish',
            'Finnish','French','Italian',
            'Hungarian','Dutch','Norwegian','Polish','Russian',
            'Swedish', 'Portuguese','Korean','PortugueseBrazil','Romanian',
            'SimplifiedChinese','TraditionalChinese','Thai'];
        table.langFilter = false;
        table.langFilterArray = [false,false,false,false,false, false,false,false,false,false,
            false,false,false,false,false, false,false,false,false,false,
            false];
        for (var i = 1; i < langFilters.length; i++) {
            if( d3.select("#box"+langFilters[i]).node().selected ){
                table.langFilter = true;
                table.langFilterArray[i-1] = true;
            }
        }

        table.PriceFilterArray[0] = d3.select('#minPrice').node().value;
        table.PriceFilterArray[1] = d3.select('#maxPrice').node().value;
        table.yearFilterArray[0] = d3.select('#minYear').node().value;
        table.yearFilterArray[1] = d3.select('#maxYear').node().value;
        table.ageFilterNum = d3.select('#minAge').node().value;
        table.updateTable();
    };

    function clearFilter(){
        table.platformFilter = false;
        table.platformFilterArray = [false,false, false];
        table.controllerFilter = false;
        table.genreFilter = false;
        table.genreFilterArray = [false,false,false,false,false, false,false,false,false,false,
            false,false,false]
        table.langFilter = false;
        table.langFilterArray = [false,false,false,false,false, false,false,false,false,false,
            false,false,false,false,false, false,false,false,false,false,
            false]
        table.PriceFilterArray = [0,60];
        table.yearFilterArray = [0,2019];
        table.ageFilterNum = 0;
        table.updateTable();
    }

}

	tableCreation();

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
        	'SimplifiedChinese','TraditionalChinese','Thai'];
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
