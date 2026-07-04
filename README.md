# Processing 100 天速写

一个面向 Processing / p5.js / Creative Coding 的 100 天练习仓库。每个 `Day_NNN` 文件夹是一张速写：有的是几何、粒子、噪声和递归，有的是图像、声音、交互和浏览器实验。

> 目标不是把每一天做成完整作品，而是持续积累可复用的视觉算法、交互技巧和创作灵感。

## 最新作品

### Day_067 - 星图菌丝分形

用 p5.js 2.3.0 创作的递归分形：从中心裂开的枝脉像菌丝和星图，枝端生成发光孢子，鼠标移动会轻微弯曲局部引力场。

<p>
  <a href="Day_067/">
    <img src="Day_067/Day_067.png" alt="Day_067 星图菌丝分形" width="480" />
  </a>
</p>

## 如何查看

多数早期作品是 Processing 草图，后期有 p5.js / HTML 草图。

- Processing 草图：打开对应 `Day_NNN/*.pde`。
- p5.js 草图：打开对应 `Day_NNN/index.html`。
- 如果浏览器因本地资源限制无法直接打开，可以在仓库根目录启动本地服务：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://127.0.0.1:8080/Day_067/
```

## 创作记录

- 笔记：[我来笔记](https://www.wolai.com/childhoodandy/nFdnVWMHkYxtb6QgBxHDJx?theme=dark)
- 作者：小菜与老鸟
- 平台：公众号 / 视频号 / Bilibili

## 目录

| Day | 描述 | 重要知识点 | 预览 |
| --- | --- | --- | --- |
| [Day_001](Day_001/) | 渐变圆 | `translate`, `lerpColor`, `line` | <img src="Day_001/Day_001.png" alt="Day_001" width="160" /> |
| [Day_002](Day_002/) | 水的涟漪、波纹 | `circle`, `stroke` | <img src="Day_002/Day_002.png" alt="Day_002" width="160" /> |
| [Day_003](Day_003/) | 遮罩的用法、不规则图形遮罩、线性渐变 | `PGraphics`, `mask`, `lerpColor`, `vertex` | <img src="Day_003/Day_003.png" alt="Day_003" width="160" /> |
| [Day_004](Day_004/) | 发光的几种实现方式 | `filter`, `BLUR` | <img src="Day_004/Day_004.png" alt="Day_004" width="160" /> |
| [Day_005](Day_005/) | 旋转的“冰激凌” | `arc`, `lerp`, `sin`, `cos` | <img src="Day_005/Day_005.gif" alt="Day_005" width="160" /> |
| [Day_006](Day_006/) | 视频马赛克处理 | `video`, `Capture` | <img src="Day_006/Day_006.png" alt="Day_006" width="160" /> |
| [Day_007](Day_007/) | 识别指尖颜色生成平台与小球碰撞 | `video`, `Capture`, `Box2d` | <img src="Day_007/Day_007.png" alt="Day_007" width="160" /> |
| [Day_008](Day_008/) | 曲线运动轨迹 | `ellipse`, `sin`, `cos` | <img src="Day_008/Day_008.png" alt="Day_008" width="160" /> |
| [Day_009](Day_009/) | 瞅你咋滴 | `PVector` | <img src="Day_009/Day_009.png" alt="Day_009" width="160" /> |
| [Day_010](Day_010/) | 叠加旋转方块的声音可视化练习 | `Array`, `minim` | <img src="Day_010/Day_010.png" alt="Day_010" width="160" /> |
| [Day_011](Day_011/) | 镜像绘画的秘密 | `line` | <img src="Day_011/Day_011.png" alt="Day_011" width="160" /> |
| [Day_012](Day_012/) | 彩色纹理 | `noise` | <img src="Day_012/Day_012_1.png" alt="Day_012" width="160" /> |
| [Day_013](Day_013/) | 粒子的音乐躁动 | `noise`, `sound` | <img src="Day_013/Day_013.png" alt="Day_013" width="160" /> |
| [Day_014](Day_014/) | 初识 3D 方块 | `P3D`, `box` | <img src="Day_014/Day_014.png" alt="Day_014" width="160" /> |
| [Day_015](Day_015/) | tiled contour | `p5.js`, `beginContour`, `endContour` | <img src="Day_015/Day_015.png" alt="Day_015" width="160" /> |
| [Day_016](Day_016/) | curveTightness | `curveTightness` | <img src="Day_016/Day_016.png" alt="Day_016" width="160" /> |
| [Day_017](Day_017/) | 字体点阵 | `textToPoints` | <img src="Day_017/Day_017.png" alt="Day_017" width="160" /> |
| [Day_018](Day_018/) | noise 静态流场 | `noise` | <img src="Day_018/Day_018.png" alt="Day_018" width="160" /> |
| [Day_019](Day_019/) | Grid 的波浪运动 | `sin`, `cos`, `keyPressed`, `keyCode` | <img src="Day_019/Day_019.png" alt="Day_019" width="160" /> |
| [Day_020](Day_020/) | 球体阴影练习 | `sphere`, `spotLight` | <img src="Day_020/Day_020.png" alt="Day_020" width="160" /> |
| [Day_021](Day_021/) | loading | `HSB`, `sin`, `cos` | <img src="Day_021/Day_021.png" alt="Day_021" width="160" /> |
| [Day_022](Day_022/) | drawingContext 的 clip | `drawingContext` | <img src="Day_022/Day_022.png" alt="Day_022" width="160" /> |
| [Day_023](Day_023/) | 区块链鸟 | `rect`, `arc`, `drawingContext` | <img src="Day_023/Day_023.png" alt="Day_023" width="160" /> |
| [Day_024](Day_024/) | 字体像素化 | `loadPixels`, `updatePixels` | <img src="Day_024/Day_024.png" alt="Day_024" width="160" /> |
| [Day_025](Day_025/) | 暂无 | 暂无 | - |
| [Day_026](Day_026/) | 字体的噪波缩放 | `noise` | <img src="Day_026/Day_026.png" alt="Day_026" width="160" /> |
| [Day_027](Day_027/) | 国庆头像生成器 | `PGraphics`, `selectInput` | <img src="Day_027/NationalDayAvatar-946.png" alt="Day_027" width="160" /> |
| [Day_028](Day_028/) | 递归圆 | 递归 | <img src="Day_028/Day_028.png" alt="Day_028" width="160" /> |
| [Day_029](Day_029/) | 场景的渐隐渐现过渡 | `ArrayList` | <img src="Day_029/Day_029.png" alt="Day_029" width="160" /> |
| [Day_030](Day_030/) | 加载 SVG | `loadShape` | <img src="Day_030/Day_030.png" alt="Day_030" width="160" /> |
| [Day_031](Day_031/) | 图层的透明、半透明等 | `PGraphics`, `beginDraw`, `endDraw`, `clear` | <img src="Day_031/Day_031.png" alt="Day_031" width="160" /> |
| [Day_032](Day_032/) | p5.js 手部识别 | `Handtrack.js` | <img src="Day_032/Day_032.jpeg" alt="Day_032" width="160" /> |
| [Day_033](Day_033/) | P3D 练习 | `beginShape`, `endShape`, `vertex` | <img src="Day_033/Day_033.png" alt="Day_033" width="160" /> |
| [Day_034](Day_034/) | 完美 GIF loop | loop | <img src="Day_034/Day_034.gif" alt="Day_034" width="220" /> |
| [Day_035](Day_035/) | 生成 SVG | `svg` | <img src="Day_035/Day_035.png" alt="Day_035" width="160" /> |
| [Day_036](Day_036/) | 根据鼠标移动速度绘制不同大小的圆 | `mouseX`, `mouseY`, `pmouseX`, `pmouseY` | <img src="Day_036/Day_036.png" alt="Day_036" width="160" /> |
| [Day_037](Day_037/) | 字体轮廓 | `PFont`, `PShape`, `getVertexCount`, `getVertex` | <img src="Day_037/Day_037.png" alt="Day_037" width="160" /> |
| [Day_038](Day_038/) | 加载图片显示字体像素 | `loadPixels`, `updatePixels` | <img src="Day_038/Day_038.gif" alt="Day_038" width="160" /> |
| [Day_039](Day_039/) | 待补充 | 待补充 | - |
| [Day_040](Day_040/) | 播放 GIF 动图 | `gif-animation` | <img src="https://gitee.com/Childhood/blog-pic-1/raw/master/2021/11/13/playgif.gif" alt="Day_040" width="160" /> |
| [Day_041](Day_041/) | 播放 GIF 动图，控制动画速度 | `image` | <img src="https://gitee.com/Childhood/blog-pic-1/raw/master/2021/11/13/gif_1.gif" alt="Day_041" width="160" /> |
| [Day_042](Day_042/) | 使用精灵图播放动图 | `get`, `JSONObject` | <img src="https://gitee.com/Childhood/blog-pic-1/raw/master/2021/11/13/spritesheet.gif" alt="Day_042" width="160" /> |
| [Day_043](Day_043/) | 简易钟摆 | `sin`, `frameCount`, `translate` | <img src="Day_043/Day_043.gif" alt="Day_043" width="160" /> |
| [Day_044](Day_044/) | 点石成路 | `PVector`, `ArrayList` | <img src="Day_044/Day_044.gif" alt="Day_044" width="160" /> |
| [Day_045](Day_045/) | 图片镜像反转 | `scale` | <img src="Day_045/Day_045.png" alt="Day_045" width="160" /> |
| [Day_046](Day_046/) | 生命游戏寻找周边邻居原理演示 | `for loop` | <img src="Day_046/Day_046.gif" alt="Day_046" width="160" /> |
| [Day_047](Day_047/) | 基本的粒子系统 | `PVector`, particle system | <img src="https://mmbiz.qpic.cn/mmbiz_gif/o2DBIZCS4KrpGvGqWGoz8VSb5t7lM13NW1IxEoK2NqXFiaqcWkqCjZia5eLBSLLbcnV4ywl4evd3MCfTyQ51Cw4w/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1" alt="Day_047" width="160" /> |
| [Day_048](Day_048/) | Agent 文字 | `PVector` | <img src="Day_048/Day_048.png" alt="Day_048" width="160" /> |
| [Day_049](Day_049/) | 熟悉 3D 绘图操作 | `P3D`, `rotateY`, `rotateX` | <img src="Day_049/Day_049.png" alt="Day_049" width="160" /> |
| [Day_050](Day_050/) | 读取 data 文件夹下按修改时间排序的文件 | `Arrays`, `Comparator`, `File`, `listFiles` | - |
| [Day_051](Day_051/) | 沙画风向测试 | `pixels` | <img src="Day_051/Day_051.png" alt="Day_051" width="160" /> |
| [Day_052](Day_052/) | 子弹与高斯正态分布 | `randomGaussian` | <img src="Day_052/Day_052_1.png" alt="Day_052" width="160" /> |
| [Day_053](Day_053/) | 缩放 scale 与保持大小不变 | `scale` | <img src="Day_053/Day_053.gif" alt="Day_053" width="160" /> |
| [Day_054](Day_054/) | 神奇的一个函数 | `P3D`, `ArrayList` | - |
| [Day_055](Day_055/) | 沙画笔触简单模拟 | `randomGaussian` | - |
| [Day_056](Day_056/) | 2022 春节微信红包封面：小老虎 | 基本图形绘制 | - |
| [Day_057](Day_057/) | 内容多于画布时的视角运动 | `translate` | <img src="Day_057/Day_057.png" alt="Day_057" width="160" /> |
| [Day_058](Day_058/) | midi parser 暂未完成 | MIDI | - |
| [Day_059](Day_059/) | 图片像素的 3D 显示 | `sphere`, `translate` | <img src="Day_059/Day_059.png" alt="Day_059" width="160" /> |
| [Day_060](Day_060/) | 多段贝塞尔路径运动 | `bezierPoint` | <img src="Day_060/bezier.gif" alt="Day_060" width="160" /> |
| [Day_061](Day_061/) | 神奇的 random | `random`, `noise` | <img src="Day_061/Day_061.jpg" alt="Day_061" width="160" /> |
| [Day_062](Day_062/) | loop | `p5.createLoop` | <img src="Day_062/Day_062.gif" alt="Day_062" width="160" /> |
| [Day_063](Day_063/) | Processing 不重启动态修改参数变量 | `WatchService`, `Thread` | <img src="Day_063/Day_063.png" alt="Day_063" width="160" /> |
| [Day_064](Day_064/) | 震动 | `navigator.vibrate` | <img src="Day_064/Day_064.png" alt="Day_064" width="160" /> |
| [Day_065](Day_065/) | 噪波运动 | `noise` | <img src="Day_065/Day_065.png" alt="Day_065" width="160" /> |
| [Day_066](Day_066/) | emoji 沙画 | 二维数组 | <img src="Day_066/Day_066.png" alt="Day_066" width="160" /> |
| [Day_067](Day_067/) | 星图菌丝分形 | `p5.js 2.3.0`, 递归分形, `bezier`, `createGraphics`, `HSB` | <img src="Day_067/Day_067.png" alt="Day_067" width="160" /> |

## 维护约定

本仓库根目录的 [`AGENTS.md`](AGENTS.md) 记录了后续自动化创作的维护规则：每次新增或更新 `Day_NNN` 创作时，必须同步更新本 README，确保 GitHub 首页始终能展示最新作品和完整索引。
