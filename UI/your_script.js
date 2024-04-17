var dataArray = [];
axios.get('http://localhost:3000/machine-data')
  .then(response => {
    console.log(response.data);
    dataArray = response.data;

    // Define SVG dimensions and margin
    var margin = { top: 20, right: 30, bottom: 60, left: 40 };
    var width = 1200 - margin.left - margin.right;
    var height = 200 - margin.top - margin.bottom;

    // Create SVG element
    var svg = d3.select("#visualization")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Extract timestamps from dataArray and convert them to JavaScript Date objects
    var timestamps = dataArray.map(function(d) {
      return new Date(d.ts);
    });

    // Get the minimum and maximum timestamps
    var minTime = d3.min(timestamps);
    var maxTime = d3.max(timestamps);

    // Define xScale for the time axis
    var xScale = d3.scaleTime()
      .domain([minTime, maxTime])
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 2]); // Assuming machine_status ranges from 0 to 100

    // Add x-axis
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    // Bind data to bars
    var bars = svg.selectAll(".bar")
      .data(dataArray)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return xScale(new Date(d.ts)); })
      .attr("width", 2) // Adjust width as needed
      .attr("y", function(d) {  return yScale(100); }) // Assuming vibration represents bar height
      .attr("height", function(d) {  return height - yScale(100); }) // Assuming vibration represents bar height
      .attr("fill", function(d) {
        // Change color based on machine_status value
        if (d.machine_status === 1) {
          return "green";
        } else if (d.machine_status === 0) {
          return "yellow";
        } else {
          return "red";
        }
      });

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
