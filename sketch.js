// a scale factor
let fscale = 1;
// nodes settings
let nodeColour = '#3FA9F5';
let axisColour = '#FF931E';
let nodeSize = 1;
let xMin = -9;
let xMax = 9;
let yMin = -9;
let yMax = 9;
let dx = 0.5; // x distance between nodes
let dy = 0.5; // y distance between nodes
let nodes = [];
let odesAxes;
let widthCanvas, heightCanvas;

// the function to be plotted
function f(x,y)
{
  return (5*sin(sqrt(x*x+y*y)))/(sqrt(x*x+y*y));
}

function setup()
{
  widthCanvas = windowWidth;
  heightCanvas = windowHeight;

  let myCanvas = createCanvas(widthCanvas, heightCanvas);
  makeFunctionNodes();

  fscale = windowWidth/(xMax*2*sqrt(2)+5);

}

// By default, p5.js loops through draw() continuously
// at 60 fps which is quite a load for the processor.
function draw()
{
  if (mouseIsPressed)
  {
    frameRate(60);
  }
  else
  {
    frameRate(10);
  }

  let backgroundColour = color('#444444');
  background(backgroundColour);
  translate(widthCanvas/2, heightCanvas/2);

  // Draw nodes
  fill(nodeColour);
  noStroke();
  for (let i=0; i < nodes.length; i++)
  {
    let px = nodes[i][0];
    let py = nodes[i][1];
    // the "pixels" are small rectangles which is faster than rendering small circles.
    rect(px*fscale,py*fscale,nodeSize,nodeSize)
  }

  // Draw axes
  stroke(axisColour);
  strokeWeight(1);
  line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[1][0]*fscale,nodesAxes[1][1]*fscale);
  line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[2][0]*fscale,nodesAxes[2][1]*fscale);
  line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[3][0]*fscale,nodesAxes[3][1]*fscale);

  //Label Axes
  textSize(16);
  strokeWeight(0);
  fill('#fff');
  textFont('Oxygen');
  text("x",nodesAxes[1][0]*fscale,nodesAxes[1][1]*(fscale));
  text("y",nodesAxes[2][0]*fscale,nodesAxes[2][1]*(fscale));
  text("z",nodesAxes[3][0]*fscale,nodesAxes[3][1]*(fscale));
}

function windowResized()
{
  widthCanvas = windowWidth;
  heightCanvas = windowHeight;
  resizeCanvas(widthCanvas, heightCanvas);
}

function functionNodesConstructor()
{
  // filling the nodes array with function points [x,y,z] where z = f(x,y).
  for (let x = xMin; x <= xMax; x += dx)
  {
    let ytemp = [];
    for (let y = yMin; y <= yMax; y += dy)
    {
      ytemp = [x, y, f(x,y)];
      nodes.push(ytemp);
    }
  }
}

function makeFunctionNodes()
{
  functionNodesConstructor();
  nodesAxes = [[0,0,0],[xMax,0,0],[0,yMax,0],[0,0,xMax]];
  rotateX3D(295 * PI / 180);
  rotateY3D(30 * PI / 180);
}

// Rotate shape around the z-axis
function rotateZ3D(theta)
{
  let sinTheta = sin(theta);
  let cosTheta = cos(theta);

  for (let n=0; n<nodes.length; n++)
  {
    let node = nodes[n];
    let x = node[0];
    let y = node[1];
    node[0] = x * cosTheta - y * sinTheta;
    node[1] = y * cosTheta + x * sinTheta;
  }
  for (n=0; n<nodesAxes.length; n++)
  {
    node = nodesAxes[n];
    x = node[0];
    y = node[1];
    node[0] = x * cosTheta - y * sinTheta;
    node[1] = y * cosTheta + x * sinTheta;
  }
}

// Rotate shape around the y-axis
function rotateY3D(theta)
{
  let sinTheta = sin(-theta);
  let cosTheta = cos(-theta);

  for (let n=0; n<nodes.length; n++)
  {
    let node = nodes[n];
    let x = node[0];
    let z = node[2];
    node[0] = x * cosTheta - z * sinTheta;
    node[2] = z * cosTheta + x * sinTheta;
  }
  for (n=0; n<nodesAxes.length; n++)
  {
    node = nodesAxes[n];
    x = node[0];
    z = node[2];
    node[0] = x * cosTheta - z * sinTheta;
    node[2] = z * cosTheta + x * sinTheta;
  }
}

// Rotate shape around the x-axis
function rotateX3D(theta)
{
  let sinTheta = sin(-theta);
  let cosTheta = cos(-theta);

  for (let n=0; n<nodes.length; n++)
  {
    let node = nodes[n];
    let y = node[1];
    let z = node[2];
    node[1] = y * cosTheta - z * sinTheta;
    node[2] = z * cosTheta + y * sinTheta;
  }
  for (n=0; n<nodesAxes.length; n++)
  {
    node = nodesAxes[n];
    y = node[1];
    z = node[2];
    node[1] = y * cosTheta - z * sinTheta;
    node[2] = z * cosTheta + y * sinTheta;
  }
}

function mouseDragged()
{
  rotateY3D((mouseX - pmouseX) * PI / 180);
  rotateX3D((mouseY - pmouseY) * PI / 180);
}

function touchMoved()
{
  rotateY3D((mouseX - pmouseX) * PI / 180);
  rotateX3D((mouseY - pmouseY) * PI / 180);
  // prevent default
  return false;
}
