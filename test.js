const { createSeal } = require('./seal');
const fs = require('fs');
const path = require('path');

/**
 * 测试脚本
 * 
 * 测试电子公章生成器的各种参数组合
 */

// 测试参数
const testName = '北京小米科技有限公司';
const testCode = '91110108MA01A1B2C';

console.log('开始测试印章生成...');

/**
 * 保存测试图片到文件
 * @param {Buffer} buffer - 图片 Buffer
 * @param {string} filename - 文件名
 */
function saveImage(buffer, filename) {
  fs.writeFileSync(path.join(__dirname, filename), buffer);
  console.log(`✓ 生成成功 -> ${filename}`);
}

try {
  // 测试1：默认参数（不做旧）
  console.log('\n[测试1] 默认参数（不做旧）');
  const buffer1 = createSeal(testName, testCode, 0, 40);
  saveImage(buffer1, 'test_default.png');

  // 测试2：做旧程度1（轻微做旧）
  console.log('\n[测试2] 轻微做旧（step=1）');
  const buffer2 = createSeal(testName, testCode, 1, 40);
  saveImage(buffer2, 'test_vintage_1.png');

  // 测试3：做旧程度2（中度做旧）
  console.log('\n[测试3] 中度做旧（step=2）');
  const buffer3 = createSeal(testName, testCode, 2, 40);
  saveImage(buffer3, 'test_vintage_2.png');

  // 测试4：做旧程度3（重度做旧）
  console.log('\n[测试4] 重度做旧（step=3）');
  const buffer4 = createSeal(testName, testCode, 3, 40);
  saveImage(buffer4, 'test_vintage_3.png');

  // 测试5：自定义字体大小（60px）
  console.log('\n[测试5] 自定义字体大小（60px）');
  const buffer5 = createSeal(testName, testCode, 0, 60);
  saveImage(buffer5, 'test_large_font.png');

  // 测试6：自定义字体大小 + 做旧
  console.log('\n[测试6] 自定义字体大小（30px）+ 中度做旧');
  const buffer6 = createSeal(testName, testCode, 2, 30);
  saveImage(buffer6, 'test_small_vintage.png');

  console.log('\n✅ 所有测试完成！');

} catch (error) {
  console.error('❌ 测试失败:', error.message);
  console.error(error.stack);
}
