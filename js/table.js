/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData) {

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = [];
        this.allData = teamData;
        this.platformFilter = false;
        this.platformFilterArray = [false,false, false];
        this.controllerFilter = false;
        this.genreFilter = false;
        this.genreFilterArray = [false,false,false,false,false, false,false,false,false,false, 
                                false,false,false];
        this.langFilter = false;
        this.langFilterArray = [false,false,false,false,false, false,false,false,false,false, 
                                false,false,false,false,false, false,false,false,false,false, 
                                false];
        this.PriceFilterArray = [0,60];
        this.yearFilterArray = [0,2019];
        this.ageFilterNum = 0;
        this.network;

        /** letiables to be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 80,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        // goal graph size & marginal
        this.marginal_LR = 10;
    }

    assignNetwork(network){
        this.network = network;
        console.log('assigned')
        //this.drawNetwork();
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        let theData = this.allData;
        let theCell= this.cell;
        let that = this;

        let tempMax = d3.max(theData, x=>(+x.PriceFinal));
        //console.log(tempMax);
        //let tempMin = tempMax;

        // Create the axes
        this.priceScale = d3.scaleLinear()
            .domain([0, tempMax])
            .range([0,that.cell.width])
            .nice();
        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers


        //Set sorting callback for clicking on Team header
        //Clicking on headers should also trigger collapseList() and updateTable().

    }

    drawNetwork(){
        this.network.updateNetwork(this.tableElements);
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let that = this;

        let gamenameSelected = d3.select("#gameselector").node().value; 
        let gameSelected = that.allData.filter((d)=>{return (d.QueryName == gamenameSelected)})[0];
        //console.log(that.tableElements[0]);
        //calcLinks(gameSelected, that.tableElements);
        let neighborPairs = parseNeighborList(gameSelected);
        neighborPairs = that.filterNeighbors(neighborPairs);
        //let neighborPairs = [[1, 6],[3, 4],[5, 3]];
        that.tableElements = [];
        that.tableElements.push(gameSelected);
        neighborPairs.sort(function(a,b){
            return (b[1] - a[1]); 
        });

        for (var i = 0; i < d3.min([neighborPairs.length, 30]); i++) {
            let theNeighbor = that.allData[neighborPairs[i][0]];
            theNeighbor.linkCount = neighborPairs[i][1];
            that.tableElements.push(theNeighbor);
        }

        console.log(that.tableElements);
        //that.tableElements


        /*that.tableElements.sort(function(a,b){
            return (b.thisLinkCount - a.thisLinkCount);
        });*/

        //console.log('updateTable', that.tableElements);

        let tr = d3.select('tbody').selectAll('tr')
            .data(that.tableElements);

        //console.log(tr);

        let tr_enter = tr.enter().append('tr');

        //console.log(tr);

        tr.exit().remove();
        tr = tr.merge(tr_enter);

        tr.each(function(x){
            d3.select(this).attr('id',d => d['QueryName']);
        });

        //Append th elements for the Team Names

        let th = tr.selectAll('th').data(d=>[d]);
        let th_enter = th.enter().append('th');
        th_enter.append('text');
        th.exit().remove();
        th = th.merge(th.enter());



        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'vis' :<'bar', 'goals', or 'text'>, 'value':<[array of 1 or two elements]>}


        let td = tr.selectAll('td')
            .data((d,i)=>[
                (i!=0)? d.linkCount:'-' ,
                d.PriceFinal,
                d.ReleaseDate,
                d.SupportedLanguages, 
                d.RequiredAge, 
                ((d.ControllerSupport == 'TRUE')? 'Y':'') ,
                [d.PlatformWindows,d.PlatformMac, d.PlatformLinux],
                [d.GenreIsNonGame.toLowerCase(), d.GenreIsIndie.toLowerCase(), d.GenreIsAction.toLowerCase(), d.GenreIsAdventure.toLowerCase(), d.GenreIsCasual.toLowerCase(),
                    d.GenreIsStrategy.toLowerCase(), d.GenreIsRPG.toLowerCase(), d.GenreIsSimulation.toLowerCase(), d.GenreIsEarlyAccess.toLowerCase(),
                    d.GenreIsFreeToPlay.toLowerCase(), d.GenreIsSports.toLowerCase(), d.GenreIsRacing.toLowerCase(), d.GenreIsMassivelyMultiplayer.toLowerCase()]             
            ]);
        let td_enter = td.enter().append('td');
        let Link_svg = td_enter.filter(function (d, i) { return i === 0;}).append('svg').classed('Link_svg',true)
            .attr('width', 30).attr('height', that.cell.height);
        let Price_svg = td_enter.filter(function (d, i) { return i === 1;}).append('svg').classed('Price_svg',true)
            .attr('width', 60).attr('height', that.cell.height);
        let Year_svg = td_enter.filter(function (d, i) { return i === 2;}).append('svg').classed('Year_svg',true)
            .attr('width', that.cell.width+20).attr('height', that.cell.height)
        let Lang_svg = td_enter.filter(function (d, i) { return i === 3;}).append('svg').classed('Lang_svg',true)
            .attr('width', that.cell.width).attr('height', that.cell.height);
        let Age_svg = td_enter.filter(function (d, i) { return i === 4;}).append('svg').classed('Age_svg',true)
            .attr('width', 30).attr('height', that.cell.height);
        let Ctnlr_svg = td_enter.filter(function (d, i) { return i === 5;}).append('svg').classed('Ctnlr_svg',true)
            .attr('width', 20).attr('height', that.cell.height);
        let Pltfm_svg = td_enter.filter(function (d, i) { return i === 6;}).append('svg').classed('Pltfm_svg',true)
            .attr('width', 47).attr('height', that.cell.height);

        let Genre_svg = td_enter.filter(function (d, i) { return i === 7;}).append('svg').classed('Genre_svg',true)
            .attr('width', 500).attr('height', that.cell.height);
        let genreTags =  [
                'NonGame','Indie','Action','Adventure','Casual',
                'Strategy', 'RPG ','Simulation','EA  ','FreeToPlay',
                'Sports','Racing','MassivelyMultiplayer'];

        Link_svg.append('text');
        Genre_svg.append('rect');
        Price_svg.append('rect').attr('fill', '#b1b1b1');
        Price_svg.append('text');
        Year_svg.append('text');
        Lang_svg.append('text');
        Age_svg.append('text');
        Ctnlr_svg.append('text');
        Pltfm_svg.append('text').attr('class', 'WindowsSrpt');
        Pltfm_svg.append('text').attr('class', 'MacSrpt');
        Pltfm_svg.append('text').attr('class', 'LinuxSrpt');
        for (var i = 0; i < genreTags.length; i++) 
            Genre_svg.append('text').attr('class', 'genre'+genreTags[i]);
        

        td.exit().remove();
        td = td.merge(td_enter);

        /*console.log('aaaaa');*/
        //console.log(td.data);

        th.select('text').text(d=>d.QueryName);
        th.select('text').on('click', function(d){
            setSelectedIndex(document.getElementById('gameselector'),d.QueryName);
            that.updateTable();
        });
        td.selectAll('svg').selectAll('text')
            .attr('x', 5)
            .attr('y', that.cell.height*0.7);
        td.selectAll('svg').selectAll('.MacSrpt')
            .attr('x', 20);
        td.selectAll('svg').selectAll('.LinuxSrpt')
            .attr('x', 35);

        td.select('.Link_svg').select('text').text(d=>d);
        td.select('.Price_svg').select('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', d=>that.priceScale(d))
            .attr('height', that.cell.height);
        td.select('.Price_svg').select('text').text(d=>d);
        td.select('.Year_svg').select('text').text(d=>d);
        td.select('.Lang_svg').select('text').text(d=>d);
        td.select('.Age_svg').select('text').text(d=>d);
        td.select('.Ctnlr_svg').select('text').text(d=>d);

        td.select('.WindowsSrpt').text(d=>(d[0] == 'TRUE')? "W": "");
        td.select('.MacSrpt').text(d=>(d[1] == 'TRUE')? "M": "");
        td.select('.LinuxSrpt').text(d=>(d[2] == 'TRUE')? "L": "");
        //console.log(td.select('.'+'genre'+genreTags[1]).data());
        for (var i = 0; i < genreTags.length; i++) 
            td.select('.'+'genre'+genreTags[i]).attr('x', 38*i).text(d=>((d[i]=='true')? genreTags[i][0]+genreTags[i][1]+genreTags[i][2]+genreTags[i][3]:'-'));

        td.select('.Lang_svg')
            .on('mouseover', function(d){
                d3.select(this)
                        .append('title')
                        .text(d);
                    })
                .on('mouseout', function (d) {
                    d3.select(this).selectAll('title').remove();
                });
        this.drawNetwork();

    };

    getData(){return this.tableElements;}

    filterNeighbors(neighborPairs){
        let that = this;
        let a = neighborPairs;
        if(that.controllerFilter == true){
            a = neighborPairs.filter(function(d){
                return that.allData[d[0]].ControllerSupport == 'TRUE';
            });
        }
        //let b = a;
        if(that.platformFilter == true){
            a = a.filter(function(d){
                let bool = true;
                if(that.platformFilterArray[0] == true) bool = bool && (that.allData[d[0]].PlatformWindows == 'TRUE');
                if(that.platformFilterArray[1] == true) bool = bool && (that.allData[d[0]].PlatformLinux == 'TRUE');
                if(that.platformFilterArray[2] == true) bool = bool && (that.allData[d[0]].PlatformMac == 'TRUE');
                return bool;
            });
        }
        if(that.genreFilter == true){
            a = a.filter(function(d){
                let genreFilterAttrs =  [
                    that.allData[d[0]].GenreIsNonGame, that.allData[d[0]].GenreIsIndie, 
                    that.allData[d[0]].GenreIsAction,  that.allData[d[0]].GenreIsAdventure,
                    that.allData[d[0]].GenreIsCasual,  that.allData[d[0]].GenreIsStrategy,
                    that.allData[d[0]].GenreIsRPG   ,  that.allData[d[0]].GenreIsSimulation,
                    that.allData[d[0]].GenreIsEarlyAccess   ,
                    that.allData[d[0]].GenreIsFreeToPlay,  that.allData[d[0]].GenreIsSports,
                    that.allData[d[0]].GenreIsRacing    ,  that.allData[d[0]].GenreIsMassivelyMultiplayer];
                let bool = true;
                for(let j=0;j<genreFilterAttrs.length;j++)
                    if(that.genreFilterArray[j] == true) bool = bool && (genreFilterAttrs[j].toLowerCase()== 'true');
                return bool;
            });
        }
        if(that.langFilter == true){
            a = a.filter(function(d){
                let langTags =  [
                'English', 'Czech', 'Danish','German','Spanish',
                'Finnish','French','Italian',
                'Hungarian','Dutch','Norwegian','Polish','Russian',
                'Swedish', 'Portuguese','Korean','PortugueseBrazil','Romanian',
                'Simplified Chinese','Traditional Chinese','Thai'];
                let bool = true;
                for(let j=0;j<that.langFilterArray.length;j++){
                    if(that.langFilterArray[j] == true) {
                        let temp = that.allData[d[0]].SupportedLanguages;
                        bool = bool && (temp.indexOf(langTags[j]) != -1);
                    }
                }
                return bool;
            });
        }
        if( (!isNaN(that.PriceFilterArray[0])) && (!isNaN(that.PriceFilterArray[1])) ){
            a = a.filter(function(d){
                return (
                    ((+that.allData[d[0]].PriceFinal) < (+that.PriceFilterArray[0]) == false)
                    && ((+that.allData[d[0]].PriceFinal) > (+that.PriceFilterArray[1])) == false)
            });
        }
        if( (!isNaN(that.yearFilterArray[0])) && (!isNaN(that.yearFilterArray[1])) ){
            a = a.filter(function(d){
                let year = +(that.allData[d[0]].ReleaseDate.split(' ')[2]);
                return (
                        ( (year < (+that.yearFilterArray[0])) == false) 
                     && ( (year > (+that.yearFilterArray[1])) == false) 
                    )
            });
        }
        if( !isNaN(that.ageFilterNum) ) {
            a = a.filter(function(d){
                return ((+(that.allData[d[0]].RequiredAge) < (+that.ageFilterNum)) == false)
            });
        }
        return a;
    }

}



function parseNeighborList(gameSelected){
    let a = (gameSelected.neighborList).replace('{', '').replace('}', '').replace(' ','');
    let neighborPairs = a.split(',');
    for (let i = 0; i < neighborPairs.length; i++) {
        let j = neighborPairs[i];
        neighborPairs[i] = j.match(/\d+/g).map(Number);
    }
    return neighborPairs;
}

function setSelectedIndex(s, v) {
    for ( var i = 0; i < s.options.length; i++ ) {
        if ( s.options[i].text == v ) {
            s.options[i].selected = true;
            return;
        }
    }
}


