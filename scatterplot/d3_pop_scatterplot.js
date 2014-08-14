// Create a plotter for population based methods.  Scatterplot displays the maximum and
// average fitnesses of a population by generation.
//
// Input data is assumed to have the following format:
// [[gen,max_fitness,0],[gen,avg_fitness,1]]

var D3_Plotter = D3_Plotter || new function() {

  var Generic_Scatterplot = function() {
    var fitness_data = [];
    var colors; 
    var xScale, yScale, yAxis, xAxis, svg;

    // Create the scatterplot object which tracks population fitness.
    this.scatterplot = function(xAxisLabel, yAxisLabel, legend, scatterplot_div, point_colors) {
      var popchart = $("#pop-scatterplot-div"),
          p = 30,
          w = 500,
          h = 300;

      colors = point_colors;

      //Create scale functions
      xScale = d3.scale.linear()
      .domain([0, d3.max(fitness_data, function(d) { return d[0]; })])
      .range([p, w - p * 2]);

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
      svg = d3.select(scatterplot_div)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

      //Create circles
      svg.selectAll("circle")
      .data(fitness_data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      .attr("r", 2)
      .attr("fill", function(d) {
        return colors[d[2]];
      });

      //Create X axis
      svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h - p) + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", w)
      .attr("y", 0)
      .style("text-anchor", "end")
      .text(xAxisLabel);

      //Create Y axis
      svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + p + ",0)")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(yAxisLabel);

      if (legend) {
        // draw legend
        var legend = svg.selectAll(".legend")
        .data([['max',colors[0]],['avg',colors[1]]])
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        // draw legend colored rectangles
        legend.append("rect")
        .attr("x", w - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return d[1]; });

        // draw legend text
        legend.append("text")
        .attr("x", w - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d[0];})
      }
    }

    // Update function to add new data to the scatterplot.
    //
    // Input data is assumed to have the following format:
    // [[gen,max_fitness,0],[gen,avg_fitness,1]
    this.updateScatterplot = function(new_data) {
      // If new_data is empty, reset the plot.
      if(!new_data) {
        fitness_data = [];
      } else {
        for (var i = 0; i < new_data.length; ++i) {
          fitness_data.push(new_data[i]);
        }
      }

      //Update scale domains
      xScale.domain([0, d3.max(fitness_data, function(d) { return Math.ceil((d[0]+1)/10)*10; })]);
      yScale.domain([0, d3.max(fitness_data, function(d) { return d[1]; })]);

      //Update all circles
      svg.selectAll("circle")
      .data(fitness_data)
      .transition()
      .duration(100)
      .attr("cx", function(d) {
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      .attr("fill", function(d) {
        return colors[d[2]];
      });

      //Enter new circles
      svg.selectAll("circle")
      .data(fitness_data)
      .enter()
      .append("circle")
      .attr("cx", function(d) {
        return xScale(d[0]);
      })
      .attr("cy", function(d) {
        return yScale(d[1]);
      })
      .attr("r", 2)
      .attr("fill", function(d) {
        return colors[d[2]];
      });

      // Remove old
      svg.selectAll("circle")
      .data(fitness_data)
      .exit()
      .remove();

      // Update the axes
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

      svg.selectAll('.x.axis')
      .call(xAxis);
      svg.selectAll('.y.axis')
      .call(yAxis);            
    }

    // Remove data from what should be plotted on the scatterplot.
    this.removeData = function(data_to_remove) {
      for(var i = fitness_data.length - 1; i >= 0; --i) {
        if (fitness_data[i][0] == data_to_remove[0][0] && fitness_data[i][1] == data_to_remove[0][1]) {
          fitness_data.splice(i,1);
        }  
      }
    }
  }

  var gen_scatterplot = new Generic_Scatterplot();
  var pop_scatterplot = new Generic_Scatterplot();

  // Create the scatterplot object which tracks generational fitness.
  this.generationalScatterplot = function() {
    gen_scatterplot.scatterplot("Generation","Fitness",true,"#gen-scatterplot-div", [d3.rgb(255,0,0),d3.rgb(0,255,0)]);
  }

  // Update function to add new data to the generational scatterplot.
  //
  // Input data is assumed to have the following format:
  // [[gen,max_fitness,0],[gen,avg_fitness,1]
  this.updateGenerationalScatterplot = function(new_data) {
    gen_scatterplot.updateScatterplot(new_data);
  }

  // Create the scatterplot that tracks population fitness during a generation.
  this.populationScatterplot = function() {
    pop_scatterplot.scatterplot("Population","Fitness",false,"#pop-scatterplot-div",[d3.rgb(0,0,255)]);
  }

  // Update function to add new data to the generational scatterplot.
  //
  // Input data is assumed to have the following format:
  // [[gen,max_fitness,0],[gen,avg_fitness,1]
  // old_data is an optional argument and should be passed as null if not wanted
  this.updatePopulationScatterplot = function(new_data, old_data) {
    if (old_data != null) {
      pop_scatterplot.removeData(old_data);    
    }
    pop_scatterplot.updateScatterplot(new_data);
  }
};