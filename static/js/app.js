var plotData = [];

function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`

    d3.json(url).then(function(response){
      console.log(response)
      // Set TABLE variable for the sample-metadata and CLEAR with .html("")

      var table = d3.select("#sample-metadata").html("")
      // Set CELL variable and APPEND the OBJECT data (entries) for each (key and value pair)

      var cell = table.append("td");
      Object.entries(response).forEach(([key, value]) => {
        var row = cell.append("tr");
        row.text(`${key}: ${value}`);
      });
    });

    console.log("END==buildMetadata(sample) function");

}

function buildCharts(sample) {
  // Initialize variable and call the `d3.json` get the data for the plots

  var plotDataset = `/samples/${sample}`
  console.log("plotDataset=", plotDataset);
  d3.json(plotDataset).then(function(plotData){
    // Time to do a bubble chart

    var bubbleChart ={
      x: plotData.otu_ids,
      y: plotData.sample_values,
      mode: 'markers',

      marker: {
        color: plotData.otu_ids,
        size: plotData.sample_values
      },
      text: plotData.otu_labels
    };

    var bubbleLayout = {
      height: 800,
      width: 1000,

  };

    var bubbleData = [bubbleChart]

    Plotly.newPlot("bubble", bubbleData,bubbleLayout );
    // Time to build a Pie Chart

    var pieChart = {
        values: plotData.sample_values.slice(0,8), 
        labels: plotData.otu_ids.slice(0,8), 
        hoverinfo: plotData.otu_labels.slice(0,8), 
        text: plotData.otu_labels.slice(0,8), 
        type: "pie"
    };

    var pieData = [pieChart];
    var pieLayout = {
        height: 600,
        width: 600,
    };

    Plotly.newPlot("pie", pieData, pieLayout);
 });
};

function init() {

  // Initialize a variable for UI Select (dropdown datalist for UI select)
  var selector = d3.select("#selDataset");
  // D3 to UI list of sample names for selector options

  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Construct the FIRST UI SAMPLE SELECTED and build the initial plots

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });

}

function optionChanged(newSample) {

  // NEW SAMPLE GET for each time a different sample is picked from the list
  buildCharts(newSample);
  buildMetadata(newSample);
}
// Initialize the dashboard
init();
