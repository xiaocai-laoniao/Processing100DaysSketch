// https://openprocessing.org/sketch/1250878

// 小菜与老鸟 源码分析

// 1. 整体身体分解
// 2. 基本图元，包括rect、arc、circle、ellipse、triangle
// 3. 随机，包括颜色、长宽大小、位置、图案模式等

const URL = [
  "https://coolors.co/eb300f-fe7688-fff566-212121-2eb254",
  "https://coolors.co/550527-688e26-faa613-f44708-a10702-e1d6de",
  "https://coolors.co/124e78-f0f0c9-f2bb05-d74e09-6e0e0a",
  "https://coolors.co/564787-dbcbd8-f2fdff-9ad4d6-101935"
]
let COLS;

function setup() {
  const s = min(windowWidth, windowHeight);
  createCanvas(s, s);
  frameRate(0.75);
  noLoop();
}

function touchEnded() {
  redraw();
}

function draw() {
  // 根据url中的色值创建颜色数组
  COLS = createCols(URL[frameCount % URL.length]);
  // 对数组进行洗牌操作，打乱颜色的顺序，这样即使使用了同一个url中的色彩值，按照数组索引编号取到的颜色值具有随机性
  COLS = shuffle(COLS);
  background(COLS[4]);
  clear();
  // 随机一个系数
  const mult = random(0.7, 1.05);
  // 根据屏幕宽高确定一个单元格尺寸
  const u = min(width, height) * 0.15 * mult;
  // face width 脸部宽度
  const fw = u;
  // face height 脸部高度
  const fh = u;
  // mouse width 嘴巴宽度
  const mw = random() > 0.5 ? u * 0.5 * random(0.8, 5) : u * 0.5 * random(0.5, 1.3);
  // mouse height 嘴巴高度
  const mh = u * 0.5 * random(0.5, 1.8);
  // body width 身体宽度
  const bw = u * 2;
  // body height 身体高度
  const bh = bw;
  // tail height 尾巴高度
  const th = u * 2 * random(0.5, 1.5);
  // 中间点x
  const cx = width * 0.5;
  // 中间点y
  const cy = height * 0.55;
  // 鸟的左上角横坐标x，用于translate后使用相对位置
  const x = cx - (bw) / 2;
  // 鸟的左上角纵坐标y，用于translate后使用相对位置
  const y = cy - (fh + bh);
  // 树木宽度
  const treeLen = width * 0.6;

  // 绘制 bird 栖息的树木
  noStroke();
  fill(0);
  rect(cx - treeLen * 0.5, cy, treeLen, 20);

  // 绘制 bird
  push();
  translate(x, y);
  Bird(fw, fh, mw, mh, bw, bh, th);
  pop();
}

// 绘制鸟
function Bird(fw, fh, mw, mh, bw, bh, th) {
  ellipseMode(CENTER);
  rectMode(CORNER);
  noStroke();

  push();

  //face
  const fr = min(fw, fh) / 2;
  fill(COLS[3]);
  rect(0, 0, fw, fh, fr, 0, 0, 0);
  push();
  drawingContext.clip();
  fill(COLS[4]);
  circle(fw / 2, fh, fw);
  eye(fw * 0.75, fh * 0.25, fr / 2, 0);
  pop();

  //mouse
  push();
  translate(fw, 0);

  fill(COLS[2]);
  if (mw > mh) {
    rect(0, 0, mw - mh + 1, mh);
    arc(mw - mh, mh, mh * 2, mh * 2, -PI / 2, 0);
  } else arc(0, mh, mw * 2, mh * 2, -PI / 2, 0);
  pop();

  //body
  const br = min(bw, bh);
  const brw = bw - br / 2;
  const brh = bh - br / 2;
  translate(0, fh);
  drawRectTile(0, 0, brw, brh);
  drawArcUnit(brw, br / 2, br, br, -PI / 2, 0);
  drawArcUnit(bw - brw, brh, br, br, PI / 2, PI);
  drawRectTile(bw - brw, br / 2, brw, brh);

  // tail
  const tw = bw / 2;
  let tr;
  translate(bw - tw, bh);

  if (tw > th) {
    tr = max(tw, th) * 2;
    drawArcUnit(tw, 0, tr, tr, PI / 2, PI);
  } else {
    tr = min(tw, th) * 2;
    drawRectTile(0, 0, tw, th - tr / 2);
    drawArcUnit(tw, th - tr / 2, tr, tr, PI / 2, PI);
  }
  pop();

}

// 绘制眼睛
// 不同直径的圆进行叠加，形成眼白、瞳孔等
function eye(cx, cy, dia, c) {
  push();
  translate(cx, cy);
  fill(255);
  circle(0, 0, dia);
  fill(random(COLS));
  circle(0, 0, dia * 0.8);
  fill(0);
  circle(0, 0, dia * 0.5);
  pop();
}

// arc单元绘制，用于body、tail的arc部分
function drawArcUnit(cx, cy, wdia, hdia, sr, er) {
  const cArr = shuffle(COLS);
  ellipseMode(CENTER);
  push();
  translate(cx, cy);
  noStroke();
  fill(cArr[0]);
  arc(0, 0, wdia, hdia, sr, er);

  push();
  drawingContext.clip();

  const rn = random();

  if (rn > 0.5) {
    for (let i = 0; i < 3; i++) {
      fill(cArr[i]);
      ellipse(0, 0, wdia / 3 * (3 - i), hdia / 3 * (3 - i));
    }
  } else {
    const ishori = random() > 0.5 ? true : false;
    for (let i = 0; i < 6; i++) {
      fill(cArr[i % cArr.length]);
      if (ishori) rect(-wdia / 2, -hdia / 2 + hdia / 6 * i, wdia, hdia / 6 + 1);
      else rect(-wdia / 2 + wdia / 6 * i, -hdia / 2, wdia / 6 + 1, hdia);
    }
  }
  pop();
  pop();
}

const UNITFUNCS = [check, triPattern, curveRect, stripe];
// const UNITFUNCS = [check];
// const UNITFUNCS = [triPattern];
// const UNITFUNCS = [curveRect];
// const UNITFUNCS = [stripe];

// rect单元绘制，4种模式进行随机，读者可以注释掉原本的4个模式
// 打开上面单个模式注释，来看看不同模式的样子
function drawRectTile(x, y, w, h) {
  const fn = int(random() * UNITFUNCS.length);
  UNITFUNCS[fn](x, y, w, h, shuffle(COLS));
}

// stripe 模式
function stripe(x, y, w, h, cArr) {
  const ishori = random() > 0.5 ? true : false;
  for (let i = 0; i < 3; i++) {
    fill(cArr[i]);
    if (ishori) rect(x, y + h / 3 * i, w, h / 3 + 1);
    else rect(x + w / 3 * i, y, w / 3 + 1, h);
  }
}

// curveRect 模式
function curveRect(x, y, w, h, cArr) {
  const r = min(w, h) / 2;
  fill(cArr[0]);
  rect(x, y, w, h);
  push();
  drawingContext.clip();
  translate(x + int(random(2)) * w, y);
  fill(cArr[1]);
  circle(0, 0, min(w, h) * 2);
  pop();
}

// tri 模式
function triPattern(x, y, w, h, cArr) {
  const span = w / 5;
  noStroke();
  push();
  translate(x, y);
  fill(cArr[0]);
  rect(0, 0, w, h);
  push();
  drawingContext.clip();
  const xSpan = w / 3;
  const ySpan = h / int(random(1, 3));
  let c = 0;
  for (let y = 0; y < h; y += ySpan) {
    const xOff = c % 2 == 0 ? 0 : xSpan / 2 * 0;
    for (let x = 0; x < w; x += xSpan) {
      fill(cArr[1]);
      triangle(x + xOff, y, x + xSpan + xOff, y, x + xSpan / 2 + xOff, y + ySpan);
    }
    c++;
  }
  pop();
  pop();
}

// check 模式
function check(x, y, w, h, cArr) {
  const span = w / 5;
  noStroke();
  push();
  translate(x, y);
  fill(cArr[0]);
  rect(0, 0, w, h);
  push();
  drawingContext.clip();

  const xSpan = w / 3;
  const ySpan = h / 3;

  let c = 0;
  for (let y = 0; y < h; y += ySpan) {
    const cOff = c % 2 == 0 ? 0 : 1;
    for (let x = 0; x < w; x += xSpan) {
      fill(cArr[0 + cOff]);
      rect(x, y, xSpan / 2, ySpan);
      fill(cArr[1 - cOff]);
      rect(x + xSpan / 2, y, xSpan / 2, ySpan);
    }
    c++;
  }
  pop();
  pop();
}


// 随机颜色
function createCols(url) {
  // 找到最后的斜杠 / 
  let slaIndex = url.lastIndexOf("/");
  // 截取斜杠后面的字符串，得到 eb300f-fe7688-fff566-212121-2eb254 这样多个使用-连接的颜色
  let colStr = url.slice(slaIndex + 1);
  // 将上一步的颜色字符串用 - 分割，得到如 ["eb300f", "fe7688", "fff566", "212121", "2eb254"]的颜色数组
  let colArr = colStr.split("-");
  // 使用数组的map方法，映射得到如如 ["#eb300f", "#fe7688", "#fff566", "#212121", "#2eb254"]的颜色数组
  return colArr.map(c => "#" + c)
}