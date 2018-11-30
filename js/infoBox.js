class InfoBox{
    constructor(){
        this.game=null;
        this.svg = d3.select('#infoBox');
        this.width = 600;
        this.height = 300
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
            .attr('x',0)
            .attr('y',40)
            .attr('width',20)
            .attr('height',20)

        this.svg.append('text')
            .attr('id','Metacritic')
            .classed('infoBox',true)
            .attr('x',5)
            .attr('y',40)

        this.svg.append('text')
            .attr('id','gameDescription')
            .classed('infoBox',true)
            .attr('x',5)
            .attr('y',60)

    }



    wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.1, // ems
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
        this.svg.select('#gameTitle').text('Title: ' + gameSelected.QueryName);
        this.svg.select('#Metacritic').text('MetaCritic')
        this.svg.select('#gameDescription').text(gameSelected.AboutText)
            .call(this.wrap,this.width-10)
            .attr('overflow','scroll')


    }
}
