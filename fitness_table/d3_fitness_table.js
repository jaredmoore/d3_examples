// Constructs a table to show the different components of an individual by generation for 
// an evolutionary algorithm.

var D3_FitnessTable = D3_FitnessTable || new function() {
    var dataset = [];
    var prev_row;

    this.table = function(genome_len) {
        // Generate the headers.
        var headers = [];
        headers.push({label:"Generation",fixed_width:true,col_span:1});
        headers.push({label:"Fitness",fixed_width:true,col_span:1});
        headers.push({label:"Genome",fixed_width:false,col_span:genome_len});

        // Calculate the width of the Gene cells based on available width and number of genes.
        var gene_width = (document.getElementById('container').offsetWidth - 200)
        // console.log(document.getElementById('container').offsetWidth, gene_width, Math.floor(gene_width).toString()+"px");

        table = d3.select("#fitness_table").append("table")
                                               .attr("id", "fitness_log_table")
                                               //.style("visibility","hidden"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

        // table.style("border-collapse", "collapse")
            // .style("border", "2px black solid")

        // append the header row
        thead.append("tr")
            .selectAll("th")
            .data(headers)
            .enter()
            .append("th")
                .style("width", function(d) { return d.fixed_width ? "100px" : Math.floor(gene_width).toString()+"px";})
                .attr("colspan", function(d) {return d.col_span;})
                .text(function(d) { return d.label; });

        // create a row for each object in the data
        var rows = tbody.selectAll("tr")
            .data(dataset)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(d){return d;})
            .enter()
            .append("td")
                .style("border", "1px black solid")
                .style("padding", "4px")
                .text(function(d){return d;});
    }

    this.updateTable = function(row_info, genome_key) {
        // Define text color based on the state of the current row and the previous row.
        var data_coloring = ["inherit","inherit"]; // 0's for Iteration and Fitness automatically.
        if (prev_row) {
            for (var i = 2; i < row_info.length; ++i) {
                if (row_info[i].val < prev_row[i]) {
                    data_coloring.push("red");
                } else if (row_info[i].val > prev_row[i]) {
                    data_coloring.push("green");
                } else {
                    data_coloring.push("inherit");
                }
            }
        } else {
            for ( var i = 2; i < row_info.length; ++i) {
                data_coloring.push("inherit");
            }
        }

        var data = [];
        for (var i = 0; i < row_info.length; ++i) {
            row_info[i].min_width = i < 2 ? "100px" : "1px";
            row_info[i].color = data_coloring[i]
            if (i >= 2) {
                row_info[i].gene_descr = genome_key[i];
            }
            data.push(row_info[i]);
        }

        dataset.push(data);

        // Get a copy of the previous row for color purposes.
        prev_row = [];
        for (var i = 0; i < row_info.length; ++i) {
            prev_row.push(row_info[i].val);
        }

        var rows = tbody.selectAll("tr")
            .data(dataset)
            .enter()
            .append("tr");

        // create a cell in each row for each column
        var cells = rows.selectAll("td")
            .data(function(d){return d;})
            .enter()
            .append("td")
                .attr("class","best_ind")
                // .attr("data-gind",genome_key)
                .style("border", "1px black solid")
                .style("padding", "4px")
                .style("background-color", function(d){return d.color;})
                .attr("title", function(d){return d.visible ? "" : d.gene_descr+": "+d.val;})
                .text(function(d){return d.visible ? d.val : "";}); 

        table.style("visibility","visible");
    }
}