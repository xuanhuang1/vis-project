/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData) {

        /**List of all elements that will populate the table.*/
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData;
        this.teamData = teamData;

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


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        let theData = this.teamData;
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


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let that = this;

        let gamenameSelected = d3.select("#gameselector").node().value; 
        let gameSelected = that.tableElements.filter((d)=>{return (d.QueryName == gamenameSelected)})[0];
        //console.log(that.tableElements[0]);
        calcLinks(gameSelected, that.tableElements);

        that.tableElements.sort(function(a,b){
            return (b.thisLinkCount - a.thisLinkCount);
        });

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
                (i!=0)? d.thisLinkCount: '-' ,
                d.PriceFinal,
                d.ReleaseDate,
                d.SupportedLanguages, 
                d.RequiredAge, 
                ((d.ControllerSupport == 'TRUE')? 'Y':'') ,
                [d.PlatformWindows,d.PlatformMac, d.PlatformLinux],
                [d.GenreIsAction, d.GenreIsAdventure, d.GenreIsCasual, d.GenreIsEarlyAccess,
                    d.GenreIsFreeToPlay, d.GenreIsIndie, d.GenreIsMassivelyMultiplayer, d.GenreIsNonGame,
                    d.GenreIsRPG, d.GenreIsRacing, d.GenreIsSimulation, d.GenreIsSports, d.GenreIsStrategy]                
            ]);
        let td_enter = td.enter().append('td');
        let Link_svg = td_enter.filter(function (d, i) { return i === 0;}).append('svg').classed('Price_svg',true)
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
            .attr('width', that.cell.width).attr('height', that.cell.height);

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

        td.exit().remove();
        td = td.merge(td_enter);

        /*console.log('aaaaa');
        console.log(td.data());*/

        th.select('text').text(d=>d.QueryName);
        td.selectAll('svg').selectAll('text')
            .attr('x', 5)
            .attr('y', that.cell.height*0.7);
        td.selectAll('svg').selectAll('.MacSrpt')
            .attr('x', 20);
        td.selectAll('svg').selectAll('.LinuxSrpt')
            .attr('x', 35);

        Link_svg.select('text').text(d=>d);
        Price_svg.select('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', d=>that.priceScale(d))
            .attr('height', that.cell.height);
        Price_svg.select('text').text(d=>d);
        Year_svg.select('text').text(d=>d);
        Lang_svg.select('text').text(d=>d);
        Age_svg.select('text').text(d=>d);
        Pltfm_svg.select('.WindowsSrpt').text(d=>(d[0] == 'TRUE')? "W": "");
        Pltfm_svg.select('.MacSrpt').text(d=>(d[1] == 'TRUE')? "M": "");
        Pltfm_svg.select('.LinuxSrpt').text(d=>(d[2] == 'TRUE')? "L": "");
        Ctnlr_svg.select('text').text(d=>d);


        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Add bars for win/lose/total
        /*let bars = td_enter.filter((d) => {return d.vis == 'bar'});
        let b_svg = bars.append('svg').classed('b_svg', true);

        b_svg.append('rect');
        b_svg.append('text');

        //Create rounds texts
        let rounds = td_enter.filter((d) => {return d.vis == 'text'})
            .append('text');

        //Create diagrams in the goals column
        let goals = td_enter.filter((d) => {return (d.vis == 'goals')});
        let g_svg = goals.append('svg')
            .attr("transform", "translate("+(-that.marginal_LR*0.43)+',' + 0 + ")")
            .classed('g_svg', true);
        g_svg.append('rect')
            .classed('goalBar', true);
        g_svg.append('circle')
            .classed('goalCirc1', true);
        g_svg.append('circle')
            .classed('goalCirc2', true);

        //Set the color of all games that tied to light gray
        // let tie_goals = td_enter.filter((d) => {return (d.vis == 'goals')&&(d.value[0] == d.value[1]) });
        // let g_tie_svg = tie_goals.append('svg')
        //     .classed('t_g_svg',true);
        // g_tie_svg.append('circle')
        //     .classed('goalCircle', true)
        //     .classed('goalCircTie', true);
        // g_tie_svg.append('circle')
        //     .classed('goalCircle', true)
        //     .classed('goalCircTie', true);

        td.exit().remove();
        td = td.merge(td_enter);


        //update svgs
        let barMax = d3.max(td.filter((d) => {return d.vis == 'bar'}).data(), x=>{return x.value});
        let barMin = d3.min(td.filter((d) => {return d.vis == 'bar'}).data(), x=>{return x.value});
        let barScaler = d3.scaleLinear()
            .domain([barMin, barMax])
            .range([0,that.cell.width])
            .nice();

        that.aggregateColorScale = d3.scaleLinear()
            .domain([barMin, barMax])
            .range(['#feebe2', '#690000']);

        let bars_all = td.filter((d) => {return d.vis == 'bar'});
        bars_all.each(function (x) {
            let the_bsvg = d3.select(this).select('svg')
                .attr("width", that.cell.width)
                .attr("height", that.cell.height);
            the_bsvg.select('rect')
                .attr('width', d=>barScaler(d.value))
                .attr('height', that.cell.height)
                .style('fill', d=>that.aggregateColorScale(d.value));

            the_bsvg.select('text')
                .text(d=>d.value)
                .attr('x',d=>barScaler(d.value)-10)
                .attr('y',14)
                .attr('fill', '#ffffff');
        });

        let rounds_all = td.filter((d) => {return d.vis == 'text'}).text(d=>d.value);

        let goals_all = td.filter((d) => {return (d.vis == 'goals') });
        goals_all.each(function (x) {
            let the_gsvg = d3.select(this).select('svg')
                .attr('width', that.goalGraphWidth+that.marginal_LR*2)
                .attr('height', that.cell.height);
            the_gsvg.select('rect')
                .attr('x', d => that.goalScale(d3.min(d.value)))
                .attr('y', 3)
                .attr('width', d => that.goalScale(Math.abs(d.value[0] - d.value[1])))
                .attr('height', '14px')
                .attr("transform", "translate("+(that.marginal_LR)+',' + 0 + ")")
                .style('fill', d => {
                    if (d.value[0] > d.value[1]) return '#cb181d'; else return '#2378ae'
                });

            let a = the_gsvg.select('.goalCirc1').classed('goalCircle', false);
            let b = the_gsvg.select('.goalCirc2').classed('goalCircle', false);

            if ( a.data() === x.value[1] ) {
                let temp = a;
                a = b;
                b = temp;
            }

            a.attr('cx', d => that.goalScale(d.value[0]))
                .attr('cy', that.cell.height / 2)
                .attr('r', '7px')
                .attr("transform", "translate("+(that.marginal_LR)+',' + 0 + ")")
                .style('fill', '#cb181d')
                .attr('stroke', '#cb181d');

            b.attr('cx', d => that.goalScale(d.value[1]))
                .attr('cy', that.cell.height / 2)
                .attr('r', '7px')
                .attr("transform", "translate("+(that.marginal_LR)+',' + 0 + ")")
                .style('fill', '#2378ae')
                .attr('stroke', '#2378ae');

            if( x.value[0] == x.value[1] ){
                a.style('fill', 'gray').attr('stroke', 'gray');
                b.style('fill', 'gray').attr('stroke', 'gray');
            }
            if(x.type == 'game'){

                the_gsvg.select('rect').style('fill', 'none');
                the_gsvg.selectAll('circle')
                    .style('fill', 'none')
                    .classed('goalCircle', true);
            }

            the_gsvg.on('mouseover', function (d) {
                    d3.select(this)
                        .append('title')
                        .text('Goals Conceded: ' + d.value[0] + " Goals Made:" + d.value[1]);
                    })
                .on('mouseout', function (d) {
                    d3.select(this).selectAll('title').remove();
                });
        });

        //Srt when category clicked

        let sortAttrObj = d3.select('#matchTable').select('thead');
        let sortOpts = d3.select('#matchTable').select('thead').select('tr');
        //console.log(sortOpts);
        sortOpts.select('th').on('click',function(d){
            if(sortAttrObj.attr("sorted")  == 0) {
                that.tableElements.reverse();
                that.updateTable();
                return;
            }
            that.tableElements.sort(function(a, b) {return a.key>b.key;});
            sortAttrObj.attr("sorted", 0);
            that.updateTable();
        });

        sortOpts.selectAll('td').on('click',function(d,i){
            that.collapseList();
            let last_sorted = sortAttrObj.attr("sorted");

            if(last_sorted  == i) {
                that.tableElements.reverse();
                that.updateTable();
                return;
            }

            if(i == 0) that.tableElements.sort(function(a, b) {return a.value["Delta Goals"] < b.value["Delta Goals"];});
            if(i == 1) {
                that.tableElements.sort(function (a, b) {
                    let theSequence = ['Group', 'Round of Sixteen', 'Quarter Finals', 'Semi Finals',
                        'Fourth Place', 'Third Place', 'Runner-Up', 'Winner'];
                    return theSequence.indexOf(a.value.Result.label) < theSequence.indexOf(b.value.Result.label);
                });
            }
            if(i == 2) that.tableElements.sort(function(a, b) {return a.value.Wins < b.value.Wins;});
            if(i == 3) that.tableElements.sort(function(a, b) {return a.value.Losses < b.value.Losses;});
            if(i == 4) that.tableElements.sort(function(a, b) {return a.value.TotalGames < b.value.TotalGames;});

            sortAttrObj.attr("sorted", i);
            that.updateTable();
        });


        // hover tree highlight
        tr.on('mouseover', function(d,i){
                //let selected = d3.select(this);
                //console.log(d,i);
                that.tree.updateTree(d);

            })
            .on('mouseout', function(d){
                that.tree.clearTree();
            });*/
    };

    getData(){return this.tableElements;}

}

function calcLinks(game, list){
    list.forEach((theGame)=>{
        let maxUserCount = d3.min([game.buyers.length, theGame.buyers.length]);
        let currentLink = 0;
        for(let i=0;i<maxUserCount;i++)
            if((game.buyers[i].User_ID == theGame.buyers[i].User_ID) && 
                game.QueryName != theGame.QueryName)
                 currentLink++;
        
        theGame.thisLinkCount = currentLink;
    });
    game.thisLinkCount  = game.buyers.length+1;
}
