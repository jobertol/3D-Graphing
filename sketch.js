// a scale factor
let fscale = 1;
let ascale = 1;
let zscale = 7/5;
// nodes settings
let nodeColour = '#3FA9F5';
let axisColour = '#FF931E';
let nodeSize = 1;
let xMin = -9;
let xMax = 9;
let yMin = -9;
let yMax = 9;
let axMax = 7;
let dx = 0.5; // x distance between nodes
let dy = 0.5; // y distance between nodes
let nodes = [];
let odesAxes;
let widthCanvas, heightCanvas;
let ds, ds2;

// the function to be plotted
function f(x,y)
{
  return (5*sin(sqrt(x*x+y*y)))/(sqrt(x*x+y*y));
}

function setup()
{
  widthCanvas = 600;
  heightCanvas = 600;

  let myCanvas = createCanvas(widthCanvas, heightCanvas);

  i1 = createSlider(0.01, 0.8, 0.6, 0.01);
  i1.position(25, 550);

  i2 = createSlider(0.01, 0.5, 0.2, 0.01);
  i2.position(i1.x+i1.width+15, i1.y);

  xMax = (1-i1.value())*50;
  xMin = -(1-i1.value())*50;
  yMax = (1-i1.value())*50;
  yMin = -(1-i1.value())*50;

  ds = i1.value();
  ds2 = i2.value();

  ascale = widthCanvas/(9*2*sqrt(2)+5);
  fscale = 1/(axMax*(1-i1.value()));

  makeFunctionNodes();
}

// By default, p5.js loops through draw() continuously
// at 60 fps which is quite a load for the processor.
function draw()
{
  background('#444444');
  textSize(16);
  fill('#ffffff');
  text('H Scale', i1.x , i1.y - 15);
  fill('#ffffff');
  text('Resolution', i2.x , i2.y - 15);

  if (mouseIsPressed)
  {
    frameRate(60);
  }
  else
  {
    frameRate(10);
  }

  if(i1.value() != ds || i2.value() != ds2)
  {
    nodes = [];

    xMax = (1-i1.value())*50;
    xMin = -(1-i1.value())*50;
    yMax = (1-i1.value())*50;
    yMin = -(1-i1.value())*50;

    dy = 1-i2.value();
    dx = 1-i2.value();

    if(i1.value() < 0.3)
    {
      dy *= (2-i1.value());
      dx *= (2-i1.value());
    }
    if(i1.value() > 0.6)
    {
      dy *= (1.2-i1.value());
      dx *= (1.2-i1.value());
    }

    makeFunctionNodes();
    fscale = 1/(axMax*(1-i1.value()));

    ds = i1.value();
    ds2 = i2.value();
  }

  translate(widthCanvas/2, heightCanvas/2.5);

  // Draw nodes
  fill(nodeColour);
  noStroke();
  for (let i=0; i < nodes.length; i++)
  {
    let px = nodes[i][0];
    let py = nodes[i][1];
    // the "pixels" are small rectangles which is faster than rendering small circles.
    rect(px*ascale,py*ascale,nodeSize,nodeSize)
  }

  // Draw axes
  stroke(axisColour);
  strokeWeight(1);
  line(nodesAxes[0][0]*ascale,nodesAxes[0][1]*ascale,nodesAxes[1][0]*ascale,nodesAxes[1][1]*ascale);
  line(nodesAxes[0][0]*ascale,nodesAxes[0][1]*ascale,nodesAxes[2][0]*ascale,nodesAxes[2][1]*ascale);
  line(nodesAxes[0][0]*ascale,nodesAxes[0][1]*ascale,nodesAxes[3][0]*ascale,nodesAxes[3][1]*ascale);

  //Label Axes
  textSize(16);
  strokeWeight(0);
  fill('#fff');
  textFont('Oxygen');
  text("x",nodesAxes[1][0]*ascale,nodesAxes[1][1]*(ascale));
  text("y",nodesAxes[2][0]*ascale,nodesAxes[2][1]*(ascale));
  text("z",nodesAxes[3][0]*ascale,nodesAxes[3][1]*(ascale));
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
      ytemp = [x*axMax/xMax, y*axMax/yMax, f(x,y)*zscale];
      nodes.push(ytemp);
    }
  }
}

function makeFunctionNodes()
{
  functionNodesConstructor();
  nodesAxes = [[0,0,0],[axMax,0,0],[0,axMax,0],[0,0,axMax]];
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
  if(mouseY < 525)
  {
    rotateY3D((mouseX - pmouseX) * PI / 180);
    rotateX3D((mouseY - pmouseY) * PI / 180);
  }
}

function touchMoved()
{
  if(mouseY < 525)
  {
    rotateY3D((mouseX - pmouseX) * PI / 180);
    rotateX3D((mouseY - pmouseY) * PI / 180);
  }
  // prevent default
  return false;
}
