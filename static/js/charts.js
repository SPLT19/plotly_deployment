function init() {

  // Reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    // Filter data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// ....... 1 ........Bar chart code........
// 1. Create the buildCharts function.
//argument sample for selection in dropdown menu
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var graphArray = samples.filter(chartObj => chartObj.id == sample);

//(....3....Gauge....) variable that filters the samples for object with the desired sample number
    var metadataArray = data.metadata.filter(chartObj => chartObj.id == sample);


    //  5. Create a variable that holds the first sample in the array.
    var chartResult = graphArray[0];

//(....3....Gauge....) variable that holds the first sample in the metadata array
    var guageResult= metadataArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values. var with arrays oru and sample
    var otu_ids = chartResult.otu_ids;
    var otu_labels = chartResult.otu_labels;
    var sample_values = chartResult.sample_values;


//(....3....Gauge....) variable that holds the washing frequency
    var washingFreq = Math.round(guageResult.wfreq*100)/100;

    // 7. Create the yticks for the bar chart. ytricks- barchart
    // Get and  map top 10 otu_ids (descending order most bacteria are last) keyword: slice() method with the map() and reverse() 
    
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // 8. Create the trace for the bar chart. sample_values, otu_labels (hover text for bars)
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: yticks.map(row => row.otu_labels),
      type: "bar", orientation: "h"}
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "<b>Top 10 of Bacteria Found in Cultures</b>",
      margin: {
       l: 100,
       r: 100,
       t: 100,
       b: 30
       }
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  });
}


// .....   2   .......
//  Bubble charts

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        sizeref: 0.05,
        sizemode: 'area',
        color: otu_ids,
        colorscale: "YlGnBu"
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
            title: "<b>Bacteria Found in Cultures Per Sample</b>",
            xaxis: {
              title: {
                text: "OTU ID"}},
            hovermode: 'closest',
            height: 600,
            width: 1100
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  

//   .......    3 Gauge Chart   .......

    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      type: 'indicator',
      mode: 'gauge+number',
      value: washingFreq,
      title: {
        text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per week" 
        },
      gauge: {
        axis: {range: [null, 10]},
        bar: {color: 'goldenrod'},
        steps: [
          {range: [0, 2], color: "mediumvioletred"},
          {range: [2, 4], color: "mediumorchid"},
          {range: [4, 6], color: "plum"},
          {range: [6, 8], color: "mediumpurple"},
          {range: [8, 10], color: "mediumblue"}
        ]
      },
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     width: 600,
     height: 600
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gaughe", gaugeData,gaugeLayout);
