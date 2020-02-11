////////////////////////////////////////////////////////////////////////////////////////
/// This script is for the required portion of the homework.  The index.html references
/// it in line 57.
////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////////////
/// This first section sets up the charting area
///////////////////////////////////////////////////////////////////////////////////////

// Define svg element width and height
var svgWidth = 960;
var svgHeight = 500;

// Define margins
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

// Define chart width and height using margins
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper within the scatter element, append an Chart group that will hold our chart, 
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create chart group to hold the chart
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

////////////////////////////////////////////////////////////////////////////////////////
/// This next section reads in the data and creates the chart
///////////////////////////////////////////////////////////////////////////////////////

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

    // Define x and y scales based on the poverty and healthcare data
    // I add 2 to the max to extend the scale a bit, so I can match the solution chart axis
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)+2])
      .range([0, chartWidth]);

    // I add 2 to the max to extend the scale a bit, so I can match the solution chart axis
    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare)+2])
      .range([chartHeight, 0]);

    // Define bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale).tickValues([10,12,14,16,18,20,22]);
    var leftAxis = d3.axisLeft(yLinearScale).tickValues([6,8,10,12,14,16,18,20,22,24,26]);
  
    // Append axes to the chart area
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
  
    chartGroup.append("g")
        .call(leftAxis);
    
    // Create circles that will make up the symbols in the scatter chart
    // Bind the data to the circle elements
    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "9")
      .attr("fill", "lightblue")
      .attr("opacity", "1");


    // Add the x-axis label
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 15})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("font-weight", "500")
        .text("In Poverty (%)");

    // Add the y-axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 0)
        .attr("x", 0 - (chartHeight / 2 + margin.top))
        .attr("dy", "1em")
        .attr("font-size", "16px")
        .attr("font-weight", "500")
        .classed("axis-text", true)
        .text("Lack Healthcare (%)");

    // Add state abbreviations to bubbles
    // I selectAll 'label' here to make a holder for the text.  I couldn't use a text element
    // as it would bind the data to other text items in the html file
    var labelGroup = chartGroup.selectAll("label")
        .data(healthData)
        .enter()
        .append("text")
        .attr("font-size", "8px")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("font-weight", "500")
        .attr("dominant-baseline", "central")
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("x", d => xLinearScale(d.poverty))
        .classed("state-abbr", true)
        .text(d => d.abbr);

    
});

