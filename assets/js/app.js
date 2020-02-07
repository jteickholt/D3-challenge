
// define svg element width and height
var svgWidth = 960;
var svgHeight = 500;

// define margins
var margin = {
  top: 30,
  right: 60,
  bottom: 50,
  left: 60
};

// define chart width and height using margins
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper within the scatter element, append an SVG group that will hold our chart, 
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// create chart group to hold the chart
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read in data from csv file
d3.csv("./assets/data/data.csv").then(function(healthData) {
    var stateAbbr = healthData.map(data => data.abbr);

    // convert the strings to numeric values
    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.smokes = +data.smokes;
    });

    // define x and y scales based on the poverty and healthcare data
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, chartWidth]);

    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare)])
      .range([chartHeight, 0]);

    // define bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append axex to the chart area
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
  
    chartGroup.append("g")
        .call(leftAxis);
    
    // create circles that will make up the symbols in the scatter chart
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "9")
      .attr("fill", "lightblue")
      .attr("opacity", "1");

    // add the x-axis label
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top +15})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("font-weight", "500")
        .text("In Poverty (%)");

    // add the y-axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (chartHeight / 2 + margin.top))
        .attr("dy", "1em")
        .attr("font-size", "16px")
        .attr("font-weight", "500")
        .classed("axis-text", true)
        .text("Lack Healthcare (%)");

    // add state abbreviations to bubbles
    chartGroup.append("text")
        .data(healthData)
        .enter()
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("x", d => xLinearScale(d.poverty))
        .text("Test");

    // var textGroup = chartGroup.selectAll("text")
    //   .data(healthData)
    //   .enter()
    //   .append('text')
    //   .text(d => d.stateAbbr)
    //   .attr('color', 'white')
    //   .attr('font-size', 15)
    //   .attr("cx", d => xLinearScale(d.poverty))
    //   .attr("cy", d => yLinearScale(d.healthcare))
    //   .attr("text-anchor", "middle");
    
});

