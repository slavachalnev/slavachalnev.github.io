---
title: "What can a hidden state see?"
date: 2023-08-24
mathjax: true
---

We can visualise the forward pass of a transformer by unrolling the input tokens on the x-axis and laying out the layers on the y-axis like so:

![unrolled](/assets/visibility/transformer_diagram_2.png)

Consider the hidden state $$ h_{t, n} $$ (the output of the nth layer at position t). Which states can influence it? Which states can it influence?

![unrolled3](/assets/visibility/transformer_diagram_3.png){: width="50%" }

h is influenced by hidden states in the bottom left quadrant and can influence hidden states in the top right quadrant.

One way to visualise this is to compute the derivative of h with respect to preceding hidden states and the derivative of later hidden states with respect to h. We can then plot the results as a heatmap.

This is a plot of position 10, layer 5 for gpt2-small. Input text is ```<|endoftext|>It is done, and submitted. You can play “Survival of the Tastiest ```

![heatmap of 1 sample](/assets/visibility/1_sample.png)

The code I used to generate this is [here](https://github.com/slavachalnev/visibility). Note: I haven't yet settled on how to normalise the hidden states. I'm currently using the L2 norm of the hidden state and then summing all the gradients for each position.

We can compute the same heatmap for all positions and layers:


<div id="html" markdown="0">
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script src="/assets/visibility/vis_script_1.js"></script>

<h3>Hover over the points to see the heatmaps</h3>
<div id="heatmap-container" style="width: 500px; height: 400px;">
    <div id="heatmaps"></div>
</div>
</div>


## Speculation on what this means for features

Since early layers can't see later layers and late layers can't influence the early layers, I'm guessing that:

1. Early layers extract features that are useful at future token positions.
2. Late layers try to predict the next token.


<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML">
</script>
