class InfoBox{
    constructor(){
        this.game=null;
        this.svg = d3.select('#infoBox')
        this.width = 600
        this.height = 300
    }

    createInfoBox(){
        this.svg.append('rect')
            .attr('id','container')
            .attr('width',this.width)
            .attr('y',this.height)

        this.svg.append('text')
            .attr('id','gameTitle')
            .attr()
    }

    updateInfoBox(gameSelected){
        this.svg.select('.container').attr('fill',gameSelected.Background)

    }

}