/**
* Adapted from Mike Bostock at 
* https://beta.observablehq.com/@mbostock/d3-force-directed-graph
*
* These calendar nodes are positioned by
* simulated forces using d3-force.
*/
//value = weight of the connecting lines
const graph = {
  "nodes": [
    {"id": "Jan_01", "group": 1},
    {"id": "Jan_02", "group": 1},
    {"id": "Jan_03", "group": 1},
    {"id": "Feb_01", "group": 2},
    {"id": "Feb_02", "group": 2},
    {"id": "Feb_03", "group": 2},
    {"id": "Mar_01", "group": 3},
    {"id": "Apr_01", "group": 4},
    {"id": "May_01", "group": 5},
    {"id": "Jun_01", "group": 6},
    {"id": "Jul_01", "group": 7},
    {"id": "Aug_01", "group": 8},
    {"id": "Sep_01", "group": 9},
    {"id": "Oct_01", "group": 10},
    {"id": "Nov_01", "group": 11},
    {"id": "Dec_01", "group": 12}
  ],
  "links": [
    {"source": "Jan_01", "target": "Jan_02", "value": 1},
    {"source": "Jan_02", "target": "Jan_03", "value": 1},
     {"source": "Jan_03", "target": "Feb_01", "value": 1},
    {"source": "Feb_01", "target": "Feb_02", "value": 1},
    {"source": "Feb_02", "target": "Feb_03", "value": 1},
    {"source": "Feb_03", "target": "Mar_01", "value": 1}, 
     {"source": "Mar_01", "target": "Apr_01", "value": 1},
    {"source": "Apr_01", "target": "May_01", "value": 1},
     {"source": "May_01", "target": "Jun_01", "value": 1},
    {"source": "Jun_01", "target": "Jul_01", "value": 1},
     {"source": "Jul_01", "target": "Aug_01", "value": 1},
     {"source": "Aug_01", "target": "Sep_01", "value": 1},
     {"source": "Sep_01", "target": "Oct_01", "value": 1},
     {"source": "Oct_01", "target": "Nov_01", "value": 1},
     {"source": "Nov_01", "target": "Dec_01", "value": 1},
     {"source": "Dec_01", "target": "Jan_01", "value": 8}
  ]
}

const width = 600
const height = 400
const svg = d3
   .select("#chart-area")
   .append("svg")
   .attr("width", width)
   .attr("height", height)
   .attr("viewBox", `0 0 ${width} ${height}`)

const color = d3.scaleOrdinal(d3.schemeCategory10)

// Add "forces" to the simulation here
const simulation = d3.forceSimulation()
   .force("center", d3.forceCenter(width / 2, height / 2))
   .force("charge", d3.forceManyBody().strength(-50))
   .force("collide", d3.forceCollide(10).strength(0.9))
   .force("link", d3.forceLink().id(d => d.id))

// Change the value of alpha, so things move around when we drag a node
const onDragStart = d => {
   if (!d3.event.active) {
      simulation.alphaTarget(0.8).restart()
   }
   d.fx = d.x
   d.fy = d.y
}

// Fix the position of the node that we are looking at
const onDrag = d => {
   d.fx = d3.event.x
   d.fy = d3.event.y
}

// Let the node do what it wants again once we've looked at it
const onDragEnd = d => {
   if (!d3.event.active) {
      simulation.alphaTarget(0)
   }
   d.fx = null
   d.fy = null
}

// Dynamically update the position of the nodes/links as time passes
const onTick = () => {
   link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
   node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
}

// Add lines for every link in the dataset
const link = svg
   .append("g")
   .attr("class", "links")
   .selectAll("line")
   .data(graph.links)
   .enter()
   .append("line")
   .attr("stroke-width", d => Math.sqrt(d.value))

// Add circles for every node in the dataset
const node = svg
   .append("g")
   .attr("class", "nodes")
   .selectAll("circle")
   .data(graph.nodes)
   .enter()
   .append("circle")
   .attr("r", 5)
   .attr("fill", d => color(d.group))
   .call(
      d3
         .drag()
         .on("start", onDragStart)
         .on("drag", onDrag)
         .on("end", onDragEnd)
   )

// Basic tooltips
node.append("title").text(d => d.id)

// Attach nodes to the simulation, add listener on the "tick" event
simulation
   .nodes(graph.nodes)
   .on("tick", onTick)

// Associate the lines with the "link" force
simulation
   .force("link")
   .links(graph.links)

