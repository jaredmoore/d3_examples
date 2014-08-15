// Create a plotter for population based methods.  Barchart displays the maximum and
// average fitnesses of a population by generation.
//
// Input data is assumed to have the following format:
// [[gen,max_fitness,0],[gen,avg_fitness,1]]

var D3_Plotter = D3_Plotter || new function() {

  var Generic_Barchart = function() {
    var fitness_data = [];
    var colors; 
    var xScale, yScale, yAxis, xAxis, svg, height, width, padding, col_width, pop_size;

    // Create the barchart object which tracks population fitness.
    this.barchart = function(xAxisLabel, yAxisLabel, legend, barchart_div, point_colors, pop_size) {
      var popchart = $("#pop-barchart-div"),
          p = 30,
          w = 500,
          h = 300;

      height = h;
      width = w;
      padding = p;
      pop_size = pop_size;
      col_width = (width-2*p) / pop_size;

      colors = point_colors;

      //Create scale functions
      xScale = d3.scale.linear()
        .domain([0, pop_size])
        .range([p, w - p]);

      yScale = d3.scale.linear()
        .domain([0, d3.max(fitness_data, function(d) { return d[1]; })])
        .range([h - p, p]);

      //Define X axis
      xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .ticks(5);

      //Define Y axis
      yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .ticks(5); 

      //Create SVG element
      svg = d3.select(barchart_div)
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      //Create rectangles
      svg.selectAll("rect")
        .data(fitness_data)
        .enter()
        .append("rect")
        .attr("x", function(d,i) {
          return i*col_width+padding;  
        })
        .attr("y", function(d) { 
          return yScale(d[1]);
        })
        .attr("width", col_width)
        .attr("height", function(d) {
          return height - yScale(d[1]);
        })
        .attr("fill", function(d) {
          return colors[d[2]];
        });

      //Create X axis
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h-p+1) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", w)
        .attr("y", 26)
        .style("text-anchor", "end")
        .text(xAxisLabel);

      //Create Y axis
      svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (p-1) + ",0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisLabel);

      // Commenting out as we don't need this for a static population size.
      // if (legend) {
      //   // draw legend
      //   var legend = svg.selectAll(".legend")
      //   .data([['max',colors[0]],['avg',colors[1]]])
      //   .enter().append("g")
      //   .attr("class", "legend")
      //   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      //   // draw legend colored rectangles
      //   legend.append("rect")
      //   .attr("x", w - 18)
      //   .attr("width", 18)
      //   .attr("height", 18)
      //   .style("fill", function(d) { return d[1]; });

      //   // draw legend text
      //   legend.append("text")
      //   .attr("x", w - 24)
      //   .attr("y", 9)
      //   .attr("dy", ".35em")
      //   .style("text-anchor", "end")
      //   .text(function(d) { return d[0];})
      // }
    }

    // Update function to add new data to the barchart.
    //
    // Input data is assumed to have the following format:
    // [[gen,max_fitness,0],[gen,avg_fitness,1]
    this.updateBarchart = function(new_data) {
      // If new_data is empty, reset the plot.
      if(!new_data) {
        fitness_data = [];
      } else {
        for (var i = 0; i < new_data.length; ++i) {
          fitness_data.push(new_data[i]);
        }
      }

      //Update scale domains
      // Commenting out as we don't need this for a static population size.
      // xScale.domain([0, pop_size]);
      yScale.domain([0, d3.max(fitness_data, function(d) { return d[1]; })]);

      //Update all bars
      svg.selectAll("rect")
        .data(fitness_data)
        .transition()
        .duration(100)
        .attr("x", function(d,i) {
          return i*col_width+padding;  
        })
        .attr("y", function(d) { 
          return yScale(d[1])-padding;
        })
        .attr("width", col_width)
        .attr("height", function(d) {
          return height - yScale(d[1]);
        })
        .attr("fill", function(d) {
          return colors[d[2]];
        });

      //Enter new bars
      svg.selectAll("rect")
      .data(fitness_data)
      .enter()
      .append("rect")
      .attr("x", function(d,i) {
        return i*col_width+padding;  
      })
      .attr("y", function(d) { 
        return yScale(d[1])-padding;
      })
      .attr("width", col_width)
      .attr("height", function(d) {
        return height - yScale(d[1]);
      })
      .attr("fill", function(d) {
        return colors[d[2]];
      });

      // Remove old
      svg.selectAll("rect")
      .data(fitness_data)
      .exit()
      .remove();

      // Commenting out as we don't need this for a static population size.
      // Update the axes
      //Define X axis
      // xAxis = d3.svg.axis()
      // .scale(xScale)
      // .orient("bottom")
      // .ticks(5);

      //Define Y axis
      yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(5); 

      // Commenting out as we don't need this for a static population size.
      // svg.selectAll('.x.axis')
      // .call(xAxis);
      svg.selectAll('.y.axis')
      .call(yAxis);            
    }

    // Remove data from what should be plotted on the barchart.
    this.removeData = function(data_to_remove) {
      for(var i = fitness_data.length - 1; i >= 0; --i) {
        if (fitness_data[i][0] == data_to_remove[0][0] && fitness_data[i][1] == data_to_remove[0][1]) {
          fitness_data.splice(i,1);
        }  
      }
    }
  }

  var gen_barchart = new Generic_Barchart();
  var pop_barchart = new Generic_Barchart();

  // Create the barchart object which tracks generational fitness.
  this.generationalBarchart = function() {
    gen_barchart.barchart("Generation","Fitness",true,"#gen-barchart-div", [d3.rgb(255,0,0),d3.rgb(0,255,0)]);
  }

  // Update function to add new data to the generational barchart.
  //
  // Input data is assumed to have the following format:
  // [[gen,max_fitness,0],[gen,avg_fitness,1]
  this.updateGenerationalBarchart = function(new_data) {
    gen_barchart.updateBarchart(new_data);
  }

  // Create the barchart that tracks population fitness during a generation.
  this.populationBarchart = function(pop_size) {
    pop_barchart.barchart("Population","Fitness",false,"#pop-barchart-div",[d3.rgb(0,0,255)],pop_size);
  }

  // Update function to add new data to the generational barchart.
  //
  // Input data is assumed to have the following format:
  // [[gen,max_fitness,0],[gen,avg_fitness,1]
  // old_data is an optional argument and should be passed as null if not wanted
  this.updatePopulationBarchart = function(new_data, old_data) {
    if (old_data != null) {
      pop_barchart.removeData(old_data);    
    }
    pop_barchart.updateBarchart(new_data);
  }
};