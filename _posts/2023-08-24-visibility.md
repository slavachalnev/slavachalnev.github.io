---
title: "What can a transformer's hidden state see?"
date: 2023-08-24
---

We can visualise the forward pass of a transformer by unrolling the input tokens on the x-axis and laying out the layers on the y-axis like so:

![unrolled](/assets/transformer_diagram_2.png)

Consider the hidden state $ h_{t, n} $ (the output of the nth layer at position t). Which states can influence it? Which states can it influence?

![unrolled3](/assets/transformer_diagram_3.png){: width="50%" }

$ h_{t, n} $ is influenced by hidden states in the bottom left quadrant and can influence hidden states in the top right quadrant.

One way to visualise this is to compute the derivative of $ h $ with respect to preceding hidden states and the derivative of later hidden states with respect to $ h $. We can then plot the results as a heatmap.

This is a plot of position 10, layer 5 for gpt2-small. Input text is ```<|endoftext|>It is done, and submitted. You can play “Survival of the Tastiest ```

![heatmap of 1 sample](/assets/1_sample.png)

The code I used to generate this is [here](https://github.com/slavachalnev/visibility).

We can compute the same heatmap for all positions and layers:

<div id="html" markdown="0">
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<h3>Hover over the points to see the heatmaps</h3>
<div id="heatmap-container" style="width: 400px; height: 400px;">
    <div id="heatmaps"></div>
</div>

<script>
    window.onload = function() {
        fetch('/assets/heatmaps.json')
            .then(response => response.json())
            .then(data => {
                var m = 12, n = 20; // Update with your actual dimensions
                var initialHeatmapData = data[0][0];
                var mainHeatmap = {
                    z: initialHeatmapData,
                    type: 'heatmap',
                    hoverinfo: 'none'
                };

                Plotly.newPlot('heatmap-container', [mainHeatmap]);

                var isUpdating = false;

                function updateHeatmap(dataPoint) {
                    if (isUpdating) return; // Skip if update is in progress

                    var i = dataPoint.points[0].y;
                    var j = dataPoint.points[0].x;

                    isUpdating = true; // Set flag before updating
                    mainHeatmap.z = data[i][j];

                    Plotly.react('heatmap-container', [mainHeatmap]).then(() => {
                        isUpdating = false; // Reset flag after update
                    });
                }

                document.getElementById('heatmap-container').on('plotly_hover', updateHeatmap);
                document.getElementById('heatmap-container').on('plotly_click', updateHeatmap);
    });
}
</script>
</div>


## Speculation on what this means for features

Since early layers can't see later layers and late layers can't influence the early layers, I'm guessing that:

1. Early layers extract features that are useful at future token positions.
2. Late layers try to predict the next token.
