const { createCanvas } = require('canvas');

/**
 * 电子公章生成模块
 * 
 * 使用 Node.js Canvas 绘制标准电子公章
 * 支持做旧效果，模拟真实公章的磨损痕迹
 */

/**
 * 应用做旧效果
 * 通过破损遮罩、噪点、裂痕和颜色淡化模拟真实公章磨损
 * 
 * @param {Canvas} canvas - Canvas 对象
 * @param {number} step - 做旧程度 (1-3)
 */
function applyVintageMask(canvas, step) {
  if (!step) {
    step = 0;
  }
  step = parseInt(step);
  step = Math.min(3, Math.max(0, step));
  const ctx = canvas.getContext('2d');
  let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let data = imageData.data;

  // ========== 第一步：破损遮罩效果 ==========
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  const maskCount = (20 + Math.floor(Math.random() * 15)) * step;

  for (let i = 0; i < maskCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 10 + 3;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, 'rgba(0,0,0,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();

  // ========== 第二步：噪点效果 ==========
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  data = imageData.data;

  const noiseProbability = 0.07 * step;
  const noiseStrength = 15 * step;

  for (let i = 0; i < data.length; i += 4) {
    if (Math.random() < noiseProbability) {
      const noise = (Math.random() - 0.5) * noiseStrength;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // ========== 第三步：裂痕效果 ==========
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  data = imageData.data;

  const crackCount = (5 + Math.floor(Math.random() * 5)) * step;
  ctx.save();
  ctx.lineCap = 'round';
  ctx.shadowColor = 'rgba(150, 0, 0, 0.5)';
  ctx.shadowBlur = 1.5;

  /**
   * 判断像素点是否属于公章区域
   * @param {number} x - 像素 x 坐标
   * @param {number} y - 像素 y 坐标
   * @returns {boolean} 是否属于公章区域
   */
  function isSealPixel(x, y) {
    const idx = (y * canvas.width + x) * 4;
    const r = data[idx], g = data[idx + 1], b = data[idx + 2], a = data[idx + 3];
    return a > 50 && r > 100 && g < 100 && b < 100;
  }

  for (let i = 0; i < crackCount; i++) {
    let tries = 0, x, y;
    // 随机寻找公章区域内的起始点
    do {
      x = Math.floor(Math.random() * canvas.width);
      y = Math.floor(Math.random() * canvas.height);
      tries++;
    } while (!isSealPixel(x, y) && tries < 100);

    if (tries >= 100) break;

    const segments = 10 + Math.floor(Math.random() * 8);

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let j = 0; j < segments; j++) {
      let nx = x + Math.floor((Math.random() - 0.5) * 20);
      let ny = y + Math.floor((Math.random() - 0.5) * 20);

      nx = Math.min(canvas.width - 1, Math.max(0, nx));
      ny = Math.min(canvas.height - 1, Math.max(0, ny));

      if (!isSealPixel(nx, ny)) {
        let found = false;
        for (let dx = -4; dx <= 4; dx++) {
          for (let dy = -4; dy <= 4; dy++) {
            let tx = nx + dx, ty = ny + dy;
            if (tx >= 0 && tx < canvas.width && ty >= 0 && ty < canvas.height) {
              if (isSealPixel(tx, ty)) {
                nx = tx;
                ny = ty;
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }
        if (!found) break;
      }

      ctx.lineTo(nx, ny);
      x = nx;
      y = ny;
    }

    ctx.strokeStyle = `rgba(150, 0, 0, ${(0.15 + Math.random() * 0.15) * step})`;
    ctx.lineWidth = 1.5 + Math.random() * 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // ========== 第四步：颜色淡化效果 ==========
  imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  data = imageData.data;

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      const isSealColor = a > 50 && r > 100 && g < 100 && b < 100;
      if (!isSealColor) continue;

      const alpha = (0.1 + Math.random() * 0.3) * step;
      data[idx] = r + (255 - r) * alpha;
      data[idx + 1] = g + (255 - g) * alpha;
      data[idx + 2] = b + (255 - b) * alpha;
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

/**
 * 创建电子公章
 * 
 * @param {string} name - 企业名称
 * @param {string} code - 统一社会信用代码
 * @param {number} [step=0] - 做旧程度 (0-3)，0 表示不做旧
 * @param {number} [nameFontSize=40] - 企业名称字体大小（像素）
 * @returns {Buffer} PNG 图片 Buffer
 */
function createSeal(name, code, step = 0, nameFontSize = 40) {
  const size = 400;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 背景透明
  ctx.clearRect(0, 0, size, size);

  const centerX = size / 2;
  const centerY = size / 2;

  // 外圈圆环参数
  const outerRadius = 160;
  const outerLineWidth = 6;
  const color = '#ff0000';

  // 绘制外圈圆环
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.lineWidth = outerLineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();

  // 企业名称弧形环绕（上半部分）
  ctx.save();
  ctx.font = `bold ${nameFontSize}px SimSun, Songti SC, serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textRadius = 125;
  const startAngle = (160 * Math.PI) / 180;
  const endAngle = (380 * Math.PI) / 180;
  const totalAngle = endAngle - startAngle;
  const angleStep = totalAngle / (name.length - 1);

  for (let i = 0; i < name.length; i++) {
    const angle = startAngle + i * angleStep;
    const x = centerX + textRadius * Math.cos(angle);
    const y = centerY + textRadius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    // 文字垂直于半径方向，顶部朝向圆心
    ctx.rotate(angle + Math.PI / 2);
    // 在垂直方向（指向圆心方向）拉长文字，scaleY > 1 表示拉高
    ctx.scale(1, 1.5);
    ctx.fillText(name[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // 绘制中心五角星（使用字符）
  ctx.save();
  ctx.font = 'bold 110px serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', centerX, centerY);
  ctx.restore();

  // 信用代码（下半部分弧形）
  ctx.save();
  // 使用黑体
  ctx.font = 'bold 18px SimHei, Heiti SC, sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const codeText = code || '';
  const codeRadius = 145;
  // 从左到右，覆盖下半部分
  const codeStartAngle = (40 * Math.PI) / 180;
  const codeEndAngle = (140 * Math.PI) / 180;
  const codeTotalAngle = codeEndAngle - codeStartAngle;
  // 减小间距系数 0.85，使文字间隔更小
  const codeAngleStep = (codeTotalAngle / (codeText.length - 1)) * 0.9;
  // 计算实际占用的角度，调整起始角度使文字居中
  const actualTotalAngle = codeAngleStep * (codeText.length - 1);
  const centerOffset = (codeTotalAngle - actualTotalAngle) / 2;

  for (let i = 0; i < codeText.length; i++) {
    const angle = codeEndAngle - centerOffset - i * codeAngleStep;
    const x = centerX + codeRadius * Math.cos(angle);
    const y = centerY + codeRadius * Math.sin(angle);

    ctx.save();
    ctx.translate(x, y);
    // 文字垂直于半径方向，顶部朝向圆心
    ctx.rotate(angle - Math.PI / 2);
    ctx.fillText(codeText[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // 应用做旧效果
  if (step > 0) {
    applyVintageMask(canvas, step);
  }

  return canvas.toBuffer('image/png');
}

module.exports = { createSeal };
