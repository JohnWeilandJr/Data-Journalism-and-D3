// Setup chart
var svgWidth = 960;
var svgHeight = 500;
var margin = { top: 20, right: 40, bottom: 60, left: 100 };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var chart = svg.append("g");

// Append a div to the body to create tooltips, assign it a class
d3.select(".chart")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0.75);

// Read in csv
var healthCare = d3.csv("healthCare.csv", function(error, healthCare) {
  if (error) throw error;

  healthCare.forEach(function(data) {
    data.poverty = +data.poverty;
    data.coverage = +data.coverage;
  });

  // Create scale functions
  var yLinearScale = d3.scaleLinear()
    .range([height, 0]);
  var xLinearScale = d3.scaleLinear()
    .range([0, width]);
 
  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
 
  //Create Min and XMax variables for each axis 
  var xMin = d3.min(healtCare, function(data) {
    return +data.poverty * 0.8;});
  var xMax = d3.max(healtCare, function(data) {
    return +data.poverty * 1.1;});
  var yMax = d3.max(healtCare, function(data) {
    return +data.coverage * 1.1;});
  
  // Scale the domain
  xLinearScale.domain([xMin, xMax]);
  yLinearScale.domain([0, yMax]);
 
  // Set up tooltip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(data) {
      var poverty = data.poverty;
      var coverage = +data.coverage;
      return ("<br> Poverty: " + poverty + "<br> No Coverage: " + coverage)
    });
 
  // Create tooltip and draw cirlces
  chart.call(toolTip);
  
  chart.selectAll("circle")
    .data(healthCare)
    .enter().append("circle")
      .attr("cx", function(data, index) {
        console.log(data.poverty);
        return xLinearScale(data.poverty);
      })
      .attr("cy", function(data, index) {
        return yLinearScale(data.coverage);
      })
      .attr("r", "15")
      .attr("fill", "green")
      .attr("stroke", "black")
      attr("opacity", 0.75)
      .on("mouseover", function(data) {
        toolTip.show(data);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

  // Add Text Element to the "g" Element
	var text = chart.selectAll("text")
    .data(healthCare)
    .enter()
    .append("text");

    // Append state abbreviations
    var textLabels = text
      .attr("x", function(data, index) {
        return xLinearScale(+data.poverty) - 6;
      })
      .attr("y", function(data, index) {			  			
        return yLinearScale(data.coverage) + 3;
      })
      .text(function(data) {
        return data.abbr;
      })
      .attr("font-family", "times-new-roman")
      .attr("font-size", "10px")
      .attr("fill", "black");


  // Append charts for x and y axis
  chart
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x-axis")
    .call(bottomAxis);

  chart
    .append("g")
    .call(leftAxis);
    
  // Append lables for charts and axis'
	chart
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - height / 1.25)
    .attr("dy", "1em")
    .attr("class", "axis-text")
    .attr("data-axis-name", "Coverage")
    .text("% With No Coverage")

  chart
    .append("text")
    .attr("transform", "translate(" + width / 2.75 + ", " + (height + margin.top + 20) + ")")
    .attr("class", "axis-text active")
    .attr("data-axis-name", "Poverty")
    .text("% In Poverty");
    });