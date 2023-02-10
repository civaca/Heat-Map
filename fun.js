document.addEventListener("DOMContentLoaded",()=>{
//fetchind data
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then(response=>response.json())
.then(data=>{ const dataset=data;

const w=1300;
const h=500;
const padding=60;
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const w1=200;
const h1=15;
const padding1=18;
//scale 
const xScale=d3.scaleTime().domain(d3.extent(dataset["monthlyVariance"],d=> d3.timeParse("%Y")(d["year"])))
.range([padding,w-padding])

const yScale=d3.scaleBand().domain([0,1,2,3,4,5,6,7,8,9,10,11])
.rangeRound([0,h-padding])

const tempScale=d3.scaleQuantize().domain(d3.extent(dataset["monthlyVariance"],d=>d["variance"]))//ColorsScale
        .range(['#0066CC', '#99CCFF', '#CCE5FF', '#FFFF99','#FF9933','#FFB266','#FF3333'])

const scaleLegend=d3.scaleQuantile().domain(d3.extent(dataset["monthlyVariance"],d=>d["variance"]))//Legens Scale
.range([w1/7,2*w1/7,3*w1/7,4*w1/7,5*w1/7,6*w1/7,7*w1/7,])

//creating svg
const svg=d3.select("body")
        .append("svg")
        .attr("width",w)
        .attr("height",h)

//Tooltip
const tooltip=d3.select("body")
                .append("div")
                .attr("id","tooltip")
        
//Heat-map
        svg.selectAll("rect")
        .data(dataset["monthlyVariance"])
        .enter()
        .append("rect")
        .attr("x",(d,i)=>xScale(d3.timeParse("%Y")(d["year"])))
        .attr("y",d=>yScale(d["month"]-1))
        .attr("width",5)
        .attr("height",d=> yScale.bandwidth(d["month"]))
        .attr("class","cell")
        .attr("fill",d=>tempScale(d["variance"]))
        .attr("data-month",d=>d["month"]-1)
        .attr("data-year",d=>d["year"])
        .attr("data-temp",d=>d["variance"])
           .on("mouseenter",(event,d)=>{
                tooltip
                .style("visibility","visible")
                .html(
                    "<p>"+d["year"]+"/"+(d3.timeParse("%m")(d["month"]).getMonth()+1)+"</p>"+
                    "<p> Temp:"+(d["variance"]+8.66).toFixed(2)+"°C</p>"+
                    "<p>Variance:"+d["variance"].toFixed(2)+"</p>"
                )
                .style("top", event.clientY+"px")
                .attr("data-year",d["year"])        
                .style("left", event.clientX+"px")
               
            
              
        }).on("mouseleave", (event,d)=>{
            tooltip.style("visibility","hidden")        
        })

       
    //Axis

    const xAxis=d3.axisBottom(xScale)
     const yAxis=d3.axisLeft(yScale)
     .tickFormat(d => month[d])
     const zAxis=d3.axisBottom(scaleLegend).tickFormat((d)=>d.toFixed(2)).tickValues([scaleLegend.domain()[0],...scaleLegend.quantiles()])
     
    svg.append("g")
        .attr("transform", "translate(0," + (h-padding) + ")")
        .call(xAxis)
        .attr("id","x-axis")


        svg.append("g")
        .attr("transform", "translate("+padding+",0)")
        .call(yAxis)
        .attr("id","y-axis")
        
//legends colors
        svg.append("g")
        .attr("id","legend")
        .selectAll("rect")
        .data(dataset["monthlyVariance"])
        .enter()
        .append("rect")
        .attr("x",(d,i)=>scaleLegend(d["variance"]))
        .attr("y",h-h1-padding1)
        .attr("width",(d,i)=>w1/7)
        .attr("height",h1)
        .attr("fill",d=>tempScale(d["variance"]))
        
       
 //legend axis       
        svg.append("g")
        .attr("transform", "translate("+0+"," + (h-padding1) + ")")
        .call(zAxis)
        
        
        svg.append("text")      // text label for the x axis
        .attr("x", w1+80  )
        .attr("y",  h-h1)
        .style("text-anchor", "middle")
        .text("Variance")
        .attr("id","var")
       
    })//Closing fetching
})//closing loaded