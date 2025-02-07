const emojis = ['😀', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉'];
const size = 20; // emoji所在格子大小
let rows, cols;
let grid = [];

function setup() {
    createCanvas(800, 600);
    textSize(size);
    textAlign(CENTER, CENTER);

    // 方案1: 通过降低帧率来减慢整体速度
    frameRate(30); // 可以调整这个值，数值越小下落越慢

    // 计算行列数
    rows = floor(height / size);
    cols = floor(width / size);

    // 初始化网格
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < cols; j++) {
            grid[i][j] = null;
        }
    }
}

function draw() {
    background(0);

    // 绘制网格线
    stroke(50); // 暗灰色的网格线
    strokeWeight(1);

    // 绘制垂直线
    for (let i = 0; i <= cols; i++) {
        line(i * size, 0, i * size, height);
    }

    // 绘制水平线
    for (let i = 0; i <= rows; i++) {
        line(0, i * size, width, i * size);
    }

    // 更新所有emoji的位置
    for (let i = rows - 1; i >= 0; i--) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j]) {
                updateEmojiPosition(i, j);
            }
        }
    }

    // 绘制所有emoji
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j]) {
                fill(255);
                text(grid[i][j], j * size + size / 2, i * size + size / 2);
            }
        }
    }
}

function mouseDragged() {
    // 获取鼠标所在的网格位置
    let gridX = floor(mouseX / size);
    let gridY = floor(mouseY / size);

    // 确保在网格范围内
    if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows) {
        // 在鼠标位置添加随机emoji
        grid[gridY][gridX] = random(emojis);
    }
}

function updateEmojiPosition(i, j) {
    // 如果已经在底部，不需要更新
    if (i === rows - 1) return;

    // 检查下方位置
    if (!grid[i + 1][j]) {
        // 下方空闲，直接下落
        grid[i + 1][j] = grid[i][j];
        grid[i][j] = null;
    } else {
        // 下方被占据，检查左下和右下
        let leftAvailable = j > 0 && !grid[i + 1][j - 1];
        let rightAvailable = j < cols - 1 && !grid[i + 1][j + 1];

        if (leftAvailable && rightAvailable) {
            // 随机选择左下或右下
            let goLeft = random() < 0.5;
            if (goLeft) {
                grid[i + 1][j - 1] = grid[i][j];
            } else {
                grid[i + 1][j + 1] = grid[i][j];
            }
            grid[i][j] = null;
        } else if (leftAvailable) {
            // 只能去左下
            grid[i + 1][j - 1] = grid[i][j];
            grid[i][j] = null;
        } else if (rightAvailable) {
            // 只能去右下
            grid[i + 1][j + 1] = grid[i][j];
            grid[i][j] = null;
        }
        // 如果左下右下都被占据，保持不动
    }
}
