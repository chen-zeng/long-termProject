var joinData = function(mapData,stateData)
{
   var shapes = {};
    
    mapData.features.forEach(function(feature)
    {
        //console.log("feature",feature.properties.NAME)
        shapes[feature.properties.NAME]= feature;
    })
    
    stateData.forEach(function(state)
    {
        //console.log("state",state.States);
        if(shapes[state.States])
            {
     shapes[state.States].properties.data=state; 
            }
    })
    console.log(shapes)
    

}


 


var drawPopulation = function(mapData,screen,xScaleP,yScaleP)
{    
    
    
    d3.select("#scatterplot")
    .selectAll("circle")
    .data(mapData.features)
    .enter()
    .append("circle")
    .attr("cx", function(state)
    {
        return xScaleP(state.properties.data.Population2019);
    })
    .attr("cy", function(state)
    {
        return yScaleP(state.properties.data.totCases);
    } )
    .attr("r",2)
    
 .on("mouseenter", function(state)
       {
        console.log("hovering")
        
        var xPos = d3.event.pageX;
        var yPos = d3.event.pageY;
        
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
      
        d3.select("#detail")
        .data(mapData.features)
        .enter()
        .append("p")
         .text(function(state){return state.properties.data.States});
    
    })
    
    .on("mouseleave", function(penguin)
       {
        d3.select("#tooltip")
        .classed("hidden",true);
        
         d3.select("p")
        .remove();
    })

    
    
    
    
}
 


var drawDensity = function(mapData,screen,xScaleD,yScaleD)
{  
   
    
    d3.select("#scatterplot")
    .selectAll("circle")
    .data(mapData.features)
    .enter()
    .append("circle")
    .attr("cx", function(state)
    {
        return xScaleD(state.properties.data.popDensity);
    })
    .attr("cy", function(state)
    {
        return yScaleD(state.properties.data.pctDeath);
    } )
    .attr("r",2)
    
  .on("mouseenter", function(state)
       {
        console.log("hovering")
        
        var xPos = d3.event.pageX;
        var yPos = d3.event.pageY;
        
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
      
         d3.select("#detail")
        .data(mapData.features)
        .enter()
        .append("p")
         .text(function(state){return state.properties.data.States});
    
    })
    
    .on("mouseleave", function(penguin)
       {
        d3.select("#tooltip")
        .classed("hidden",true);
        
         d3.select("p")
        .remove();
    })

}
        








var initGraph = function(stateData,mapData)
{  //size of screen
    var screen = {width:1000,height:600}
    //how much space on each side
    var margins = {left:30,right:30,top:20,bottom:20}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
    console.log(graph);
    
   joinData(mapData,stateData)
    
    var targetS = d3.select("#scatterplot")
    .append("g")
    .attr("id","#graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
   
    
    d3.select("#scatterplot")
    .attr("width", screen.width)
    .attr("height", screen.height)
    
    
    
    var xScaleP = d3.scaleLinear()
               .domain([0,40000000])
                .range([0,screen.width]);
    
    var yScaleP = d3.scaleLinear()
               .domain([0,800000])
                .range([screen.height,0]);
    
    var xScaleD = d3.scaleLinear()
               .domain([0,5000])
                .range([0,screen.width]);
    
var yScaleD = d3.scaleLinear()
               .domain([0,10])
                .range([screen.height,0]);
    
    d3.select("#den")
    .on("click",function()
        {
        console.log("density clicked");
         d3.selectAll("circle")
       .remove();
        d3.selectAll("path")
       .remove();
    drawPopulation(mapData,screen,xScaleP,yScaleP);
    
    })
    
   d3.select("#pop")
    .on("click",function()
        {
        console.log("population clicked");
     d3.selectAll("circle")
       .remove();
       d3.selectAll("path")
       .remove();
  drawDensity(mapData,screen,xScaleD,yScaleD);
    
    })
    
    
    
}

var setBanner = function(message)
{
    d3.select("#banner")
    .text(message);
}


var succFCN = function(values)
{
    console.log("values",values);
    setBanner("Here are Charts");
    
  initGraph(values[0],values[1]);
    
}

var failFCN = function (error)
{
    console.log("error",error);
    setBanner("Charts are missing");
}


var statePromise = d3.csv("csv/popCovid.csv")
var geoPromise = d3.json("json/map.json")

var promises = [statePromise,geoPromise];

Promise.all(promises)
.then(succFCN,failFCN)