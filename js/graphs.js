
var joinData = function(mapData,stateData,centerData)
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
   
    
    centerData.forEach(function(center)
    {
        if(shapes[center.state])
            {
     shapes[center.state].properties.center=center; 
            }
 
    })
      console.log(shapes);                  
                       
}


var makeTranslateString = function(x,y)
{
    return "translate("+x+","+y+")";
}



var drawAxesD = function(graphDim,margins,
                         xScaleD,yScaleD)
{
   var xAxis = d3.axisBottom(xScaleD);
    var yAxis = d3.axisLeft(yScaleD);

    var axes=d3.select("#scatterplot")
     .append("g")
 
 axes.append("g")
 .attr("transform","translate("+(margins.left)+","+(margins.top+graphDim.height)+")")
    .call(xAxis)
    axes.append("g")
    .attr("transform","translate("+(margins.left)+","+(margins.top)+")")
    .call(yAxis)

 
}



var drawLabelsD = function(graphDim,margins)
{
   var labels = d3.select("#scatterplot")
    .append("g")
    .classed("labels",true)
    
    //title
    labels.append("text")
    .text("Population Density vs. Percentage of COVID Death")
    .classed("title",true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graphDim.width/2))
    .attr("y",margins.top/2)
    
    //x
    labels.append("text")
        .text("Population Density")
         .classed("label",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graphDim.width/2))
    .attr("y",margins.top+graphDim.height+margins.bottom/2)

    //y
    labels.append("g")
    .attr("transform","translate(50,"+ 
              (margins.top+(graphDim.height/2))+")")
        .append("text")
        .text("Percentage of Covid Death")
        .classed("label",true)
   .attr("text-anchor","middle")
    .attr("transform","rotate(270)") 
}





var drawAxesP = function(graphDim,margins,
                         xScaleP,yScaleP)
{
   var xAxis = d3.axisBottom(xScaleP);
    var yAxis = d3.axisLeft(yScaleP);

    var axes=d3.select("#scatterplot")
     .append("g")
 
 axes.append("g")
 .attr("transform","translate("+(margins.left)+","+(margins.top+graphDim.height)+")")
    .call(xAxis)
    axes.append("g")
    .attr("transform","translate("+(margins.left)+","+(margins.top)+")")
    .call(yAxis)

 
}


var drawLabelsP = function(graphDim,margins)
{
   var labels = d3.select("#scatterplot")
    .append("g")
    .classed("labels",true)
    
    //title
    labels.append("text")
    .text("Population 2019 vs. Total COVID Cases")
    .classed("title",true)
    .attr("text-anchor","middle")
    .attr("x",margins.left+(graphDim.width/2))
    .attr("y",margins.top/2)
    
    //x
    labels.append("text")
        .text("Population of 2019")
         .classed("label",true)
        .attr("text-anchor","middle")
        .attr("x",margins.left+(graphDim.width/2))
    .attr("y",margins.top+graphDim.height+margins.bottom/2)

    //y
    labels.append("g")
    .attr("transform","translate(20,"+ 
              (margins.top+(graphDim.height/2))+")")
        .append("text")
        .text("Total COVID Cases")
        .classed("label",true)
   .attr("text-anchor","middle")
    .attr("transform","rotate(270)") 
}



var drawPopulation = function(mapData,target,xScaleP,yScaleP)
{    
    
    
   target.selectAll("circle")
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
        console.log("hovering Population", state.properties.data.States)
        
        var xPos = d3.event.pageX;
        var yPos = d3.event.pageY;
        
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
      d3.select("#detail")
        .append("text")
         .text(state.properties.data.States)
        .append("p")
        .text("Population of 2019: "+state.properties.data.Population2019)
        .append("p")
        .text("Total COVID Cases: "+state.properties.data.totCases);
        
    
    })
    
    .on("mouseleave", function(state)
       {
        d3.select("#tooltip")
        .classed("hidden",true);
                
        d3.select("#tooltip p")
        
        .remove();
                 d3.select("#tooltip text")
       
        .remove();
        
    })

    
    
    
    
}
 





var drawDensity = function(mapData,target,xScaleD,yScaleD)
{   
   target.selectAll("circle")
    .data(mapData.features)
    .enter()
    .append("circle")
    .attr("cx", function(state)
    { if(state.properties.data.States=="District of Columbia"){return false;}
        else{return xScaleD(state.properties.data.popDensity);}
    })
    .attr("cy", function(state)
    {  if(state.properties.data.States=="District of Columbia"){return false;}
        else{
        return yScaleD(state.properties.data.pctDeath);}
    } )
    .attr("r",function(state)
    {  if(state.properties.data.States=="District of Columbia"){return false;}
        else
        {return 2;}
    })
    .attr("fill",function(state){if(state.properties.data.States=="Puerto Rico"){return "red";}})
    
  .on("mouseenter", function(state)
       {
        console.log("hovering Density",state.properties.data.States)
        
 var xPos = d3.event.pageX;
        var yPos = d3.event.pageY;
        
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
      d3.select("#detail")
        .append("text")
         .text(state.properties.data.States)
        .append("p")
        .text("Population Density: "+state.properties.data.popDensity)
        .append("p")
        .text("Pct COVID Death: "+state.properties.data.pctDeath);
        
    
    })
    
    .on("mouseleave", function(state)
       {
        d3.select("#tooltip")
        .classed("hidden",true);
                
        d3.select("#tooltip p")
        
        .remove();
                 d3.select("#tooltip text")
       
        .remove();
     
        
    })


}



var colorMap = function(mapData,pathGen,projection,rScale)
 { //Define Colors
    var colorY = d3.scaleQuantize()
                    .range(["rgb(255, 242, 204)","rgb(255, 229, 153)","rgb(255, 217, 102)","rgb(241, 194, 50)","rgb(191, 144, 0)","rgb(127,96,0)","rgb(120, 63, 4)"]);
   //colorY.range()
    var colorR = d3.scaleQuantize()
                    .range(["rgb(244, 204, 204)","rgb(234, 153, 153)","rgb(224, 102, 102)","rgb(204, 0, 0)","rgb(153, 0, 0)","rgb(102,0,0)"]);
    
    var colorB = d3.scaleQuantize()
                    .range(["rgb(207, 226, 243)","rgb(159, 197, 232)","rgb(111, 168, 220)","rgb(61, 133, 198)","rgb(61, 133, 198)","rgb(7, 55, 99)"]);
    
 //range for each
        var minCases = d3.min(mapData.features,function(states)
                              {     
            return states.properties.data.popDensity;
                            } )
        //console.log("min",minCases);
    
   //Yellow 
    colorY.domain([minCases
       ,
        d3.max(mapData.features,function(states)
               {return states.properties.data.popDensity;})
    ]);
   //Red 
    colorR.domain([d3.min(mapData.features,function(states)
               {return states.properties.data.pctDeath;}),
                   d3.max(mapData.features,function(states)
               {return states.properties.data.pctDeath;})
                  ]);
    //Blue
    colorB.domain([d3.min(mapData.features,function(states)
               {return states.properties.data.popDensity;}),
                   d3.max(mapData.features,function(states)
               {return states.properties.data.popDensity;})
                  ]);
    
    
     //Population Density  
            d3.select("#map")
            .selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("d",pathGen)
         .attr("fill",function(state)
                    {
          var valueY = state.properties.data.popDensity;
            //console.log("valueState",valueY,colorY(valueY))
            if(valueY)
            {
                return colorY(valueY);
            }
            else
                {
                    return "#ccc";
                }
                    })
           .attr("stroke",function(state)
                    {
          var valueB = state.properties.data.popDensity;
            
            if(valueB)
            {
                return colorB(valueB);
            }
            else
                {
                    return "#ccc";
                }
                    }) 
    ;
    
            d3.select("#map")
            .selectAll("circle")
            .data(mapData.features)
            .enter()
            .append("circle")
    //x 
            .attr("cx",
                 function(state)
            { /*console.log("position",[state.properties.center.longitude,state.properties.center.latitude]);
             console.log("state name",state.properties.data.States);*/
               if(state.properties.data.States=="Puerto Rico")
               {return -100000000;}
             else{
                   return projection([state.properties.center.longitude, state.properties.center.latitude])[0];}
            })
    //y
            .attr("cy",function(state)
            { console.log("position",[state.properties.center.longitude,state.properties.center.latitude]);
             console.log("state name",state.properties.data.States);
              if(state.properties.data.States=="Puerto Rico")
               {return -100000000;}
             else{ return projection([state.properties.center.longitude,state.properties.center.latitude])[1];}
            })
    //size by totCases
            .attr("r",function(state)
                 {
                return rScale(state.properties.data.totCases);
            })
    //fill by colorR
            .attr("fill",function(state)
                    {
          var valueR = state.properties.data.pctDeath;
            
            if(valueR)
            {
                return colorR(valueR);
            }
            else
                {
                    return "#ccc";
                }
                    })
            .attr("stroke","gray")
    
    .on("mouseenter", function(state)
       {
        console.log("hovering Map", state.properties.data.States)
        
        var xPos = d3.event.pageX;
        var yPos = d3.event.pageY;
        
        d3.select("#tooltip")
        .classed("hidden",false)
        .style("top",yPos+"px")
        .style("left",xPos+"px")
        
      
        d3.select("#detail")
        .append("text")
        .text(state.properties.data.States)
                .append("p")
        .text("Pct COVID Death:"+" "+ state.properties.data.pctDeath) 
                .append("p")
        .text("Population Density:"+" " +state.properties.data.popDensity)
                .append("p")
        .text("Total COVID Cases:"+" "+state.properties.data.totCases)
                .append("p")
        .text("Population of 2019:"+" " +state.properties.data.Population2019)
                ;
    
    })
    
    .on("mouseleave", function(state)
       {
        d3.select("#tooltip")
        .classed("hidden",true);
                
        d3.select("#tooltip p")
        .remove();
                 d3.selectAll("#tooltip text")
        .remove();
    })
    
}







var drawLegend = function(graphDim,margins)
{
    var legend = d3.select("svg")
       .append("g")
    .classed("legend",true)
    .attr("transform","translate("+(graphDim.width)+","+(margins.top+10)+")");
    
    
    
   var categories = [
       {
           class:"circleSize",
            column:"totCases=450,000",
           color:"red",
            radius:16
       },
       {
           class:"circleSize",
            column:"totCases=100,000",
           color:"red",
           radius:9.5
       },
       {
           class:"circleSize",
            column:"totCases=50,000",
           color:"red",
           radius:6
       },
       {
           class:"circleColor",
            column:"pctDeath > 6.5%",
           color:"rgb(102,0,0)",
           radius:9.5
       },
       {
           class:"circleColor",
            column:"pctDeath 5.3-6.5%",
           color:"rgb(204, 0, 0)",
           radius:9.5
       },
       {
           class:"circleColor",
            column:"pctDeath 3.1-6.5%",
           color:"rgb(224, 102, 102)",
           radius:9.5
       },
        {
           class:"circleColor",
            column:"pctDeath 1.9-3.1%",
           color:"rgb(234, 153, 153)",
           radius:9.5
       },
       {
           class:"circleColor",
            column:"pctDeath 1.9-3.1%",
           color:"rgb(244, 204, 204)",
           radius:9.5
       },
       {
           class:"denseColor",
            column:"popDensity > 88",
           color:"rgb(120, 63, 4)",
           radius:12
       },
       {
           class:"denseColor",
            column:"popDensity 71-88",
           color:"rgb(127,96,0)",
           radius:12
       },
       {
           class:"denseColor",
            column:"popDensity 58-71",
           color:"rgb(191, 144, 0)",
           radius:12
       },
       {
           class:"denseColor",
            column:"popDensity 42-58",
           color:"rgb(241, 194, 50)",
           radius:12
       },
       {
           class:"denseColor",
            column:"popDensity 28-42",
           color:"rgb(255, 217, 102)",
           radius:12
       },
        {
           class:"denseColor",
            column:"popDensity 15-28",
           color:"rgb(255, 217, 102)",
           radius:12
       },
        {
           class:"denseColor",
            column:"popDensity < 15",
           color:"rgb(255, 242, 204)",
           radius:12
       },
    ]
   
   
   var entries = legend.selectAll("g")
   .data(categories)
   .enter()
   .append("g")
   .classed("legendEntry",true)
   .attr("class",function(category)
        {
       return category.class;
   })
    
     
   .attr("transform",function(category,index)
        {
     return  "translate(0,"+(index*30)+")"
   })
   
   entries.append("circle")
   .attr("r",function(category)
        {
       return category.radius;
   })
    .attr("fill",function(category)
        {
       return category.color;
   })
    .attr("stroke","grey")
  
    entries.append("text")
         .text(function(catergory)
              {
        return catergory.column
    })
    .attr("x",15)
    .attr("y",10)
    
}





var initGraph = function(stateData,centerData,mapData)
{

    var screen = {width:1100,height:700}

    var margins = {left:70,right:120,top:50,bottom:70}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
  
var screenS = {width:630,height:490}

    var graphS = 
        {
            width:screenS.width-margins.left-margins.right,
            height:screenS.height - margins.top-margins.bottom
        }
    
   joinData(mapData,stateData,centerData)
    
    
    //map
    d3.select("#map")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
  var rScale = d3.scaleSqrt()
  .domain([0,d3.max(mapData.features, function(state){return state.properties.data.Population2019; })])
  .range([1,70])
    
  
    var projection = d3.geoAlbersUsa();
    
    var pathGen = d3.geoPath()
                            .projection(projection)
    d3.select("#geo")
    .on("click",function()
        {
        console.log("geoMap clicked");
         d3.selectAll("circle")
       .remove();
        d3.selectAll("g")
       .remove();
colorMap(mapData,pathGen,projection,rScale);
drawLegend(graph,margins);
       ; })
    
    //scatterplot
      
    
   
    
   
   console.log("popC")
    
    d3.select("#scatterplot")
    .attr("width", screenS.width)
    .attr("height", screenS.height);
    
      
    
    d3.select("#pop")
    .on("click",function()
        { 
        d3.select("#scatterplot circle")
       .remove();
        d3.selectAll("#scatterplot g")
        .remove();
        /*d3.selectAll("path")
       .remove();*/
        
        var target = d3.select("#scatterplot")
        .append("g")
        .attr("id","populationCanvas")
        .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
        console.log("population clicked");
        
        var xScaleP = d3.scaleLinear()
               .domain([0,40000000])
                .range([0,graphS.width]);
    
    var yScaleP = d3.scaleLinear()
               .domain([0,800000])
                .range([graphS.height,0]);
    drawPopulation(mapData,target,xScaleP,yScaleP);
    drawAxesP(graphS,margins,xScaleP,yScaleP);
    drawLabelsP(graphS,margins);

    })
    
   d3.select("#den")
    .on("click",function()
        {d3.select("#scatterplot circle")
       .remove();
        d3.selectAll("#scatterplot g")
        .remove();
       /*d3.selectAll("path")
       .remove();*/
       
       var target = d3.select("#scatterplot")
        .append("g")
        .attr("id","populationCanvas")
        .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
         
         console.log("density clicked");
        
        var xScaleD = d3.scaleLinear()
               .domain([0,600])
                .range([0,graphS.width]);
    
var yScaleD = d3.scaleLinear()
               .domain([0,10])
                .range([graphS.height,0]);
  drawDensity(mapData,target,xScaleD,yScaleD);
       drawAxesD(graphS,margins,xScaleD,yScaleD);
    drawLabelsD(graphS,margins);
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
    setBanner("COVID-19 Data by States");
    
  initGraph(values[0],values[1],values[2]);
    
}

var failFCN = function (error)
{
    console.log("error",error);
    setBanner("Charts are missing");
}


var statePromise = d3.csv("csv/popCovid.csv")
var avgPromise = d3.json("json/stateAvg.json")
var geoPromise = d3.json("json/map.json")

var promises = [statePromise,avgPromise,geoPromise];

Promise.all(promises)
.then(succFCN,failFCN)