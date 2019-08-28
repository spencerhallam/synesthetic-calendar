/**
* Adapted from Mike Bostock at 
* https://beta.observablehq.com/@mbostock/d3-force-directed-graph
*
* These calendar nodes are positioned by
* simulated forces using d3-force.
*/
//value = weight of the connecting lines

function SynYear () {}

function SynMonth (name, shortName, qtyDays, color, order, season) {
    this.name = name;
    this.shortName = shortName;
    this.qtyDays = qtyDays;
    this.color = color;
    this.order = order;
    this.season = season;
    this.getInfo = getInfo;
    this.monthData = monthData;
}
// anti-pattern! keep reading...
function getInfo() {
    return this.name + ' is month #' + this.order + ' and has ' + this.qtyDays + ' days and will be ' + this.color + ' indicating the ' + this.season + ' season.';
}
function monthData() {
    let monthMap = [];
    for(let i = 0; i < this.qtyDays; i++){
        let mapObj = `{ "id": "${this.shortName}_${i + 1}", "group": ${this.order}}`
        let parsedMap = JSON.parse(mapObj);
        monthMap.push(parsedMap);
    }

    return monthMap;
}

const jan = new SynMonth('January', 'Jan', 31, 'blue', 1, 'winter');
const feb = new SynMonth('February', 'Feb', 28, 'blue', 2, 'winter');
const mar = new SynMonth('March', 'Mar', 31, 'blue', 3, 'winter');
const apr = new SynMonth('April', 'Apr', 30, 'blue', 4, 'spring');
const may = new SynMonth('May', 'May', 31, 'blue', 5, 'spring');
const jun = new SynMonth('June', 'Jun', 30, 'blue', 6, 'spring');
const jul = new SynMonth('July', 'Jul', 31, 'blue', 7, 'summer');
const aug = new SynMonth('August', 'Aug', 31, 'blue', 8, 'summer');
const sep = new SynMonth('September', 'Sep', 30, 'blue', 9, 'summer');
const oct = new SynMonth('October', 'Oct', 31, 'blue', 10, 'fall');
const nov = new SynMonth('November', 'Nov', 30, 'blue', 11, 'fall');
const dec = new SynMonth('December', 'Dec', 31, 'blue', 12, 'fall');

const allYear = function() { 
  const sumDays = [];  
  let allMoDays = [
    jan.monthData(), 
    feb.monthData(), 
    mar.monthData(), 
    apr.monthData(), 
    may.monthData(), 
    jun.monthData(), 
    jul.monthData(), 
    aug.monthData(), 
    sep.monthData(), 
    oct.monthData(), 
    nov.monthData(), 
    dec.monthData()
];

function maker(item){
    const makerString = [];
    for(let i = 0; i < item.length; i++){
        console.log("TESTTEST01", item[i]);
        if(item[i].id === "Aug_28"){
            console.log("Aug 28 is found!");
            let today = `{"id": "${item[i].id}","group": 13}`;
            console.log("TESTTEST02", today);
            makerString.push(today);
        } else {
            console.log("TESTTEST03", item[i].id);
          makerString.push(JSON.stringify(item[i]));
        }
    }
    sumDays.push(makerString);
}

allMoDays.forEach(maker)
const finalString = sumDays.join(',')
console.log('tester:', sumDays);
// console.log('tester2:', finalString);
let finalArrayString = "[" + finalString + "]";
// console.log('Pre-Parsed JSON', finalArrayString);
let yoyo = JSON.parse(finalArrayString);
// console.log("Parsed JSON", yoyo)

return yoyo
} //end all Year

const allYearObj = allYear();

const dayNodeLinks = function(somearray){
    const linkArray = [];
    somearray.forEach(maker2);
    function maker2(item, i){
      
      let next = i + 1;
      let nextItem = (allYearObj[next]) ? allYearObj[next].id : allYearObj[0].id;
    //   let nextItemChk = (item.id === 'Dec_31') ? "Jan_1" : nextItem;
    //   console.log("ITEM.ID", item.id);
    //   console.log("JUST I", i);
    //   console.log("next Item", nextItem)
      let oneLink = `{"source": "${item.id}", "target": "${nextItem}", "value": 1 }`
      linkArray.push(oneLink)
    //   console.log('linkArray1', linkArray);
    //   console.log("rrr", oneLink);
      return true
    }
    console.log("LINKARRAY", linkArray)
    const linkString = linkArray.join(',')
    console.log('LINKARRAYtester3:', linkArray);
    console.log('LINKARRAYtester4:', linkString);
    let finalLinkString = "[" + linkString + "]";
    console.log('Pre-Parsed LINK JSON', finalLinkString);
    let yoyo2 = JSON.parse(finalLinkString);
    console.log("Parsed LINK JSON", yoyo2)
    

    return yoyo2
}

const allDayNodeLinks = dayNodeLinks(allYear());

//D3 Script

const graph = {
     "nodes": allYearObj,
     "links": allDayNodeLinks,
}

console.log("Graph.nodes", graph.nodes)

const width = 90000
const height = 70000
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
   .force("charge", d3.forceManyBody().strength(-2000))
   .force("collide", d3.forceCollide(350).strength(0.0))
   .force("link", d3.forceLink().id(d => d.id).distance(.01).strength(2))


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
//colors
var myColor = d3.scaleOrdinal().domain(graph.nodes)
  .range([
   "hsl(180, 100%, 80%)",
   "hsl(180, 100%, 50%)",
   "hsl(170, 100%, 50%)",
   "hsl(160, 100%, 50%)",
   "hsl(70, 100%, 50%)",
   "hsl(80, 100%, 50%)",
   "hsl(80, 100%, 30%)",
   "hsl(40, 100%, 50%)",
   "hsl(20, 100%, 50%)",
   "hsl(40, 100%, 100%)",
   "hsl(20, 30%, 50%)",
   "hsl(40, 30%, 50%)",
   "hsl(0, 0%, 80%)",
]);
// gradient
// var myColor = d3.scaleLinear().domain([1,10])
//   .range(["yellow", "blue"])

  // Add circles for every node in the dataset
const node = svg
   .append("g")
   .attr("class", "nodes")
   .selectAll("circle")
   .data(graph.nodes)
   .enter()
   .append("circle")
   .attr("r", 2000)
   .attr("fill", d => myColor(d.group))
   //.attr("fill", d => color(d.group))
   .call(
      d3
         .drag()
         .on("start", onDragStart)
         .on("drag", onDrag)
         .on("end", onDragEnd)
   )

// Basic tooltips
node.append("title").text(d => d.id);


// Attach nodes to the simulation, add listener on the "tick" event
simulation
   .nodes(graph.nodes)
   .on("tick", onTick)

// Associate the lines with the "link" force
simulation
   .force("link")
   .links(graph.links)

