var layout = {
    xaxis: {
        title: 'Input Tokens'
    },
    yaxis: {
        title: 'Layers'
    },
    showlegend: false,
    margin: {
        l: 50,
        r: 10,
        b: 40,
        t: 30
    },
    displayModeBar: false
};

    window.onload = function() {
        fetch('/assets/visibility/heatmaps.json')
            .then(response => response.json())
            .then(data => {
                var initialHeatmapData = data[0][0];
                var mainHeatmap = {
                    z: initialHeatmapData,
                    type: 'heatmap',
                    hoverinfo: 'none'
                };

                Plotly.newPlot('heatmap-container', [mainHeatmap], layout);

                var isUpdating = false;

                function updateHeatmap(dataPoint) {
                    if (isUpdating) return; // Skip if update is in progress

                    var i = dataPoint.points[0].y;
                    var j = dataPoint.points[0].x;

                    isUpdating = true; // Set flag before updating
                    mainHeatmap.z = data[i][j];

                    Plotly.react('heatmap-container', [mainHeatmap], layout).then(() => {
                        isUpdating = false; // Reset flag after update
                    });
                }

                document.getElementById('heatmap-container').on('plotly_hover', updateHeatmap);
                document.getElementById('heatmap-container').on('plotly_click', updateHeatmap);
    });
}