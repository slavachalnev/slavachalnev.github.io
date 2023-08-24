---
title: "What can a transformer's hidden state see?"
date: 2023-08-24
---

We can visualise the forward pass of a transformer by unrolling the input tokens on the x-axis and laying out the layers on the y-axis like so:
<div id="html" markdown="0">
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

<h1>Hover over the points to see the heatmaps</h1>
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
