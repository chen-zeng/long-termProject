/*  var drawMap = function(mapData,target,pathGen,projection)
{
    target.selectAll("path")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("d",pathGen);
}*/

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






var colorMap = function(mapData,target,pathGen,projection)
{ //Define Colors
    var colorY = d3.scaleQuantize()
                    .range(["rgb(255, 242, 204)","rgb(255, 229, 153)","rgb(255, 217, 102)","rgb(241, 194, 50)","rgb(191, 144, 0)","rgb(127,96,0)"]);
   
    var colorR = d3.scaleQuantize()
                    .range(["rgb(244, 204, 204)","rgb(234, 153, 153)","rgb(224, 102, 102)","rgb(204, 0, 0)","rgb(153, 0, 0)","rgb(102,0,0)"]);
    
 
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
    
    
     //Population Density  
           d3.select("#map")
            .selectAll("path")
            .data(mapData.features)
            .enter()
            .append("path")
            .attr("d",pathGen)
         .attr("fill",function(state)
                    {
          var value = state.properties.data.popDensity;
            //console.log("valueState",value,colorY(value))
            if(value)
            {
                return colorY(value);
            }
            else
                {
                    return "#ccc";
                }
                    })
           .attr("stroke",function(state)
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
    ;
    //Dots
    
           d3.select("#map")
            .selectAll("circle")
            .data(mapData.features)
                .enter()
            .enter()
            .append("circle")
    //x 
            .attr("cx",
                 function(d)
            { 
                    return projection([d.longitude,d.latitude])[0];           
            })
    //y
            .attr("cy",function(d)
            { 
                    return projection([d.longitude,d.latitude])[1];           
            })
    //size by totCases
                
            .attr("r",10/*function(state)
                 {
                return Math.sqrt(parseInt(state.properties.data.totCases)*0.00000001)
            }*/)
    //fill by colorR
            .attr("fill","red"/*function(state)
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
                    }*/)
            .attr("stroke","gray")
                                                       
    
}






var initGraph = function(stateData,centerData,mapData)
{

    var screen = {width:1000,height:600}

    var margins = {left:30,right:30,top:20,bottom:30}
    
    
    
    var graph = 
        {
            width:screen.width-margins.left-margins.right,
            height:screen.height - margins.top-margins.bottom
        }
 
    
   joinData(mapData,stateData,centerData)
    
    d3.select("#map")
    .attr("width",screen.width)
    .attr("height",screen.height)
    
    var targetM = d3.select("#map")
    .append("g")
    .attr("id","graph")
    .attr("transform",
          "translate("+margins.left+","+
                        margins.top+")");
    
  
    var projection = d3.geoAlbersUsa();
    
    var pathGen = d3.geoPath()
                            .projection(projection)
    

    
    colorMap(mapData,stateData,pathGen,projection);

   
}











var succFCN = function(values)
{
    console.log("values",values);
    
initGraph(values[0],values[1],values[2]);
    
}

var failFCN = function (error)
{
    console.log("error",error);
}










var statePromise = d3.csv("csv/popCovid.csv")
var avgPromise = d3.json("json/stateAvg.json")
var geoPromise = d3.json("json/map.json")

var promises = [statePromise,avgPromise,geoPromise];

Promise.all(promises)
.then(succFCN,failFCN)