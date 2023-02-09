document.addEventListener("DOMContentLoaded",()=>{
//fetchind data
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
.then(response=>response.json())
.then(data=>{ const dataset=data;

const w=500;
const h=500;
const padding=80;
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
//scale 
const xScale=d3.scaleTime().domain([d3.min(dataset["monthlyVariance"],d=> d3.timeParse("%Y")(d["year"])),d3.max(dataset["monthlyVariance"],d=> d3.timeParse("%Y")(d["year"]))])
.range([padding,w-padding])

const yScale=d3.scaleTime().domain([d3.min(dataset["monthlyVariance"],d=>d3.timeParse("%m")(d["month"])),d3.max(dataset["monthlyVariance"],d=>d3.timeParse("%m")(d["month"]))])
.range([padding,h-padding])
//creating svg
const svg=d3.select("body")
        .append("svg")
        .attr("width",w)
        .attr("height",h)
        

        svg.selectAll("rect")
        .data(dataset["monthlyVariance"])
        .enter()
        .append("rect")
        .attr("x",(d,i)=>xScale(d3.timeParse("%Y")(d["year"])))
        .attr("y",d=>yScale(d3.timeParse("%m")(d["month"])))
        .attr("width",2)
        .attr("height",d=>yScale(d3.timeParse("%m")(d["month"])))
        .attr("fill","yellow")


    //Axis

    const xAxis=d3.axisBottom(xScale)
     const yAxis=d3.axisLeft(yScale).tickFormat(d => month[d.getMonth()])
     

    svg.append("g")
        .attr("transform", "translate(0," + (h-padding) + ")")
        .call(xAxis)
        .attr("id","x-axis")

        svg.append("g")
        .attr("transform", "translate("+padding+",0)")
        .call(yAxis)
        .attr("id","y-axis")





    })//Closing fetching
})//closing loaded