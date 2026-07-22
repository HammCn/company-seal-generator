const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function createSeal(name, code, outputPath = null) {
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
  ctx.font = 'bold 40px SimSun, Songti SC, serif';
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
    // 参考HTML: ctx.rotate(angle + Math.PI / 2)
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

  const buffer = canvas.toBuffer('image/png');

  if (outputPath) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, buffer);
  }

  return buffer;
}

module.exports = { createSeal };
