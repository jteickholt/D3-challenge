////////////////////////////////////////////////////////////////////////////////////////
/// This script is for the bonus portion of the homework.  To use it, line 57 in the
/// index.html file needs to be commented out and line 58 needs to  be un-commented.
////////////////////////////////////////////////////////////////////////////////////////


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

///////////////////////////////////////////////////////////////////////////////
/// The following functions are used to make the axis interactive
///////////////////////////////////////////////////////////////////////////////

// Initial Params
var chosenXAxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var label = "Poverty:";
    }
    else {
      var label = "Income";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
////////////////////////////////////////////////////////////////////////////////////////////   
///  This next section reads in the data and creates the chart  
///////////////////////////////////////////////////////////////////////////////////////////

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
    // I add 2 to the max to extend the scale a bit, so I can match the solution chart
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)+2])
      .range([0, chartWidth]);

    // I add 2 to the max to extend the scale a bit, so I can match the solution chart
    var yLinearScale = d3.scaleLinear()
      .domain([4, d3.max(healthData, d => d.healthcare)+2])
      .range([chartHeight, 0]);

    // Define bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale).tickValues([10,12,14,16,18,20,22]);
    var leftAxis = d3.axisLeft(yLinearScale).tickValues([6,8,10,12,14,16,18,20,22,24,26]);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
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
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "9")
      .attr("fill", "lightblue")
      .attr("opacity", "1");

    // Create group for  2 x- axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

    var povertyLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)")
        .attr("font-weight","500");

    var incomeLabel = labelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income")
        .attr("font-weight","500");


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
        .attr("x", d => xLinearScale(d.chosenXAxis))
        .classed("state-abbr", true)
        .text(d => d.abbr);

    ///////////////////////////////////////////////////////////////////////////////////////
    /// This next section defines the xaxis event listener
    ///////////////////////////////////////////////////////////////////////////////////////

    // x axis labels event listener
    labelsGroup.selectAll("text")
    .on("click", function() {
    // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "income") {
            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
            povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
            incomeLabel
            .classed("active", false)
            .classed("inactive", true);
            povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        }
    });
    }).catch(function(error) {
    console.log(error);
    });

    
// });

