class InfoBox{
    constructor(){
        this.game=null;
        this.svg = d3.select('#infoBox');
        this.width = 600;
        this.height = 300;
        this.categoryList = ['SinglePlayer','Multiplayer','Coop','MMO','InAppPurchase','IncludeSrcSDK','IncludeLevelEditor','VRSupport']
    }

    createInfoBox(){
        this.svg.append('svg:image')
            .attr('id','background')
            .attr('x',0)
            .attr('y',0);

        this.svg.append('text')
            .attr('id','gameTitle')
            .classed('infoBox',true)
            .attr('x',5)
            .attr('y',20)

        this.svg.append('svg:image')
            .attr('xlink:href','https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Metacritic.svg/2000px-Metacritic.svg.png')
            .attr('x',5)
            .attr('y',30)
            .attr('width',20)
            .attr('height',20);

        this.svg.append('text')
            .attr('id','Metacritic')
            .classed('infoBox',true)
            .attr('x',30)
            .attr('y',45);

        this.svg.append('text')
          .attr('id','Categories')
          .classed('infoBox',true)
          .attr('x',5)
          .attr('y',60)

        this.svg.append('text')
          .attr('id','DLCCount')
          .classed('infoBox',true)
          .attr('x',5)
          .attr('y',115)
        this.svg.append('text')
            .attr('id','gameDescription')
            .classed('infoBox',true)
            .attr('x',5)
            .attr('y',130)

    }

    wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.5, // ems
                x = text.attr("x"),
                y = text.attr("y"),
                dy = 0.8, //parseFloat(text.attr("dy")),
                tspan = text.text(null)
                    .append("tspan")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("dy", dy + "em");
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", ++lineNumber * lineHeight + dy + "em")
                        .text(word);
                }
            }
        });
    }

    updateInfoBox(gameSelected){
        this.svg.select('#background').attr('xlink:href',gameSelected.Background);
        this.svg.select('#gameTitle').text('Title : ' + gameSelected.QueryName);
        this.svg.select('#Metacritic').text(gameSelected.Metacritic==='0'?' : Not Available' : (' : '+ gameSelected.Metacritic));
        let categoryValidate = [gameSelected.CategorySinglePlayer,gameSelected.CategoryMultiplayer,gameSelected.CategoryCoop,gameSelected.CategoryMMO,
          gameSelected.CategoryInAppPurchase,gameSelected.CategoryIncludeSrcSDK,gameSelected.CategoryIncludeLevelEditor,gameSelected.CategoryVRSupport]
        let categoryToInclude = this.categoryList.map((d,i)=>categoryValidate[i]?d:'').join(' / ');
        let sentences = gameSelected.AboutText.split('.');
        let sentencesLen = 0;
        let finalString = '';
        console.log(sentences);
        for(let i=0;i<sentences.length;i++){
          if(sentencesLen > 850) break;
          finalString += (sentences[i]+". ");
          sentencesLen += (sentences[i].length+1);
        }

        console.log(finalString);
        this.svg.select('#Categories').text('Categories : '+categoryToInclude).call(this.wrap,this.width-10);
        this.svg.select('#gameDescription').text(finalString)
            .call(this.wrap,this.width-10)
            .attr('overflow','scroll')

        this.svg.select('#DLCCount').text('DLC Count : ' + gameSelected.DLCCount)


    }
}
