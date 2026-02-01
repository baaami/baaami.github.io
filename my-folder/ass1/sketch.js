let lastMinute = -1; // Track last logged minute
let hours = 0;
let minutes = 0;
let seconds = 0;
let lastUpdate = 0;

function setup() {
  createCanvas(900, 400);
  textAlign(CENTER, CENTER);
  textSize(20);
  
  // Uncomment this to test its behavior at 11:59:59 
  // hours = 11;
  // minutes = 59;
  // seconds = 59;
}

function draw() {
  background(0); // black background
  
  // Draw laboratory table
  drawLabTable();
  
  // update every second
  if (millis() - lastUpdate >= 1000) {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
        if (hours >= 12) {
          hours = 0;
        }
      }
    }
    lastUpdate = millis();
  }
  
  // Log minute change
  if (minutes !== lastMinute) {
    console.log("Minute changed to:", minutes);
    lastMinute = minutes;
  }
  
  // Position beakers higher so they sit on the table
  let beakerY = height - 220;
  
  // Draw three cylindrical beakers: hours, minutes, seconds
  drawBeaker(width / 4, beakerY, 80, 200, hours, 12, "Hours");
  drawBeaker(width / 2, beakerY, 80, 200, minutes, 60, "Minutes");
  drawBeaker((3 * width) / 4, beakerY, 80, 200, seconds, 60, "Seconds");
}

function drawBeaker(x, y, w, h, value, maxValue, label) {
  let topY = y - h / 2;
  let bottomY = y + h / 2;
  let ellipseHeight = w * 0.3; // Height of the ellipse for 3D effect
  
  // Draw measurement scales first
  drawScale(x, y, w, h, maxValue);
  
  // Draw the cylindrical beaker outline
  noFill();
  stroke(200);
  strokeWeight(2);
  
  // Side walls of cylinder
  line(x - w/2, topY, x - w/2, bottomY);
  line(x + w/2, topY, x + w/2, bottomY);
  
  // Bottom ellipse
  ellipse(x, bottomY, w, ellipseHeight);
  
  // Top ellipse (back arc only)
  arc(x, topY, w, ellipseHeight, 0, PI);
  
  // --- WATER ---
  let fillRatio = constrain(value / maxValue, 0, 1);
  let waterHeight = h * fillRatio;
  let waterTop = bottomY - waterHeight;
  
  noStroke();
  fill(0, 150, 255, 180);
  
  // Water body
  rect(x - w/2, waterTop, w, waterHeight);
  
  // Water surface ellipse
  if (fillRatio > 0) {
    ellipse(x, waterTop, w, ellipseHeight);
  }
  
  // Water bottom ellipse
  if (fillRatio > 0) {
    ellipse(x, bottomY, w, ellipseHeight);
  }
  
  // Redraw front arc of top rim
  noFill();
  stroke(200);
  strokeWeight(2);
  arc(x, topY, w, ellipseHeight, PI, TWO_PI);
  
  // Labels
  noStroke();
  fill(255);
  text(value + " ml", x, bottomY + 35);
  text(label, x, topY - 25);
}

function drawScale(x, y, w, h, maxValue) {
  let topY = y - h / 2;
  let bottomY = y + h / 2;
  let scaleX = x + w/2 + 5; // Position scale slightly to the right of beaker
  
  // Determine scale intervals
  let majorInterval, minorInterval, textInterval;
  if (maxValue <= 12) {
    majorInterval = 2;
    minorInterval = 1;
    textInterval = 2;
  } else {
    majorInterval = 10;
    minorInterval = 5;
    textInterval = 10;
  }
  
  stroke(150);
  fill(200);
  textSize(10);
  textAlign(LEFT, CENTER);
  
  // Draw scale marks
  for (let i = 0; i <= maxValue; i += minorInterval) {
    let ratio = i / maxValue;
    let markY = bottomY - (h * ratio);
    
    // Major marks (longer lines)
    if (i % majorInterval === 0) {
      strokeWeight(1.5);
      line(scaleX, markY, scaleX + 12, markY);
      
      // Add numbers for major marks at text intervals
      if (i % textInterval === 0) {
        noStroke();
        text(i, scaleX + 15, markY);
        stroke(150);
      }
    } 
    // Minor marks (shorter lines)
    else {
      strokeWeight(1);
      line(scaleX, markY, scaleX + 6, markY);
    }
  }
  
  // Reset text settings for other elements
  textSize(20);
  textAlign(CENTER, CENTER);
}

function drawLabTable() {
  // Table dimensions
  let tableHeight = 135;
  let tableY = height - tableHeight;
  let tableTopThickness = 30;
  
  // Table top surface
  fill(100, 70, 45);
  noStroke();
  rect(0, tableY, width, tableTopThickness);
  
  // Table top edge (front face)
  fill(80, 55, 35);
  rect(0, tableY + tableTopThickness, width, 8);
  
  // Table legs (more realistic positioning)
  fill(70, 50, 30);
  let legWidth = 20;
  let legHeight = tableHeight - tableTopThickness - 8;
  
  // Four corner legs with proper spacing from edges
  let legInset = 40;
  
  // Front left leg
  rect(legInset, tableY + tableTopThickness + 8, legWidth, legHeight);
  // Front right leg  
  rect(width - legInset - legWidth, tableY + tableTopThickness + 8, legWidth, legHeight);
  // Back left leg
  rect(legInset + 10, tableY + tableTopThickness + 8, legWidth - 5, legHeight);
  // Back right leg (with perspective)
  rect(width - legInset - legWidth + 10, tableY + tableTopThickness + 8, legWidth - 5, legHeight);
  
  // Table apron (the frame under the table top)
  fill(85, 60, 40);
  rect(20, tableY + tableTopThickness, width - 40, 25);
  
  // Wood grain on table top
  stroke(120, 85, 55);
  strokeWeight(1);
  for (let i = 0; i < 8; i++) {
    let grainY = tableY + 3 + i * 1.5;
    line(30, grainY, width - 30, grainY);
  }
  
  // Table surface highlight/shine
  fill(255, 255, 255, 25);
  noStroke();
  ellipse(width/2, tableY + 8, width * 0.6, 12);
  
  // Add some shadow under the table
  fill(0, 0, 0, 40);
  ellipse(width/2, height - 5, width * 0.9, 15);
}