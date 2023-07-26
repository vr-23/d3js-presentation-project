// prettier-ignore
function createPie(width, height) {
    var pie = d3.select("#pie")
                  .attr("width", width)
                  .attr("height", height);

    pie.append("g")
         .attr("transform", "translate(" + width / 2 + ", " + (height / 2 + 10) + ")")
         .classed("chart", true);

    // Add a legend group
    pie.append("g")
        .attr("transform", "translate(" + (width - 100) + ", 20)")
        .classed("legend", true);

    pie.append("text")
        .attr("x", width / 2)
        .attr("y", "1em")
        .attr("font-size", "1.5em")
        .style("text-anchor", "middle")
        .classed("pie-title", true);
}

// prettier-ignore
function drawPie(data, currentYear) {
    var pie = d3.select("#pie");

    var arcs = d3.pie()
                 .sort((a, b) => {
                     if (a.continent < b.continent) return -1;
                     if (a.continent > b.continent) return 1;
                     return a.emissions - b.emissions;
                 })
                 .value(d => d.emissions);

    var path = d3.arc()
                 .outerRadius(+pie.attr("height") / 2 - 50)
                 .innerRadius(0);

    var yearData = data.filter(d => d.year === currentYear);
    var continents = [];
    for (var i = 0; i < yearData.length; i++) {
        var continent = yearData[i].continent;
        if (!continents.includes(continent)) {
            continents.push(continent);
        }
    }

    var colorScale = d3.scaleOrdinal()
                       .domain(continents)
                       .range(["#FF0000", "#0000FF", "#00FF00", "#FFA500", "#FFFF00"]);

    var update = pie
                    .select(".chart")
                    .selectAll(".arc")
                    .data(arcs(yearData));

    update
      .exit()
      .remove();

    update  
      .enter()
        .append("path")
        .classed("arc", true)
        .attr("stroke", "#dff1ff")
        .attr("stroke-width", "0.25px")
      .merge(update)
        .attr("fill", d => colorScale(d.data.continent))
        .attr("d", path);

    // Legend creation
    var legend = pie.select(".legend")
      .selectAll(".legend-item")
      .data(continents);

    legend.exit().remove();

    var legendEnter = legend.enter()
      .append("g")
      .classed("legend-item", true)
      .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");

    legendEnter.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => colorScale(d));

    legendEnter.append("text")
      .attr("x", 20)
      .attr("y", 12.5)
      .text(d => d);

    pie.select(".pie-title")
       .text("Total emissions by continent and region, " + currentYear);
}
