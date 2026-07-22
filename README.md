# Company Seal Generator - 电子公章生成器

基于 Node.js 的电子公章生成工具，使用 Canvas 绘制高清 PNG 图片。

## 安装

```bash
npm install company-seal-generator
```

## 使用

```javascript
const { createSeal } = require('company-seal-generator');

// 仅生成 buffer
const buffer = createSeal('企业名称', '统一社会信用代码');

// 生成并保存到指定路径
const buffer = createSeal('企业名称', '统一社会信用代码', './output/seal.png');
```

## API

### createSeal(name, code, outputPath?)

| 参数       | 类型   | 必填 | 说明                                       |
| ---------- | ------ | ---- | ------------------------------------------ |
| name       | string | 是   | 企业名称，将弧形环绕在公章上半部分         |
| code       | string | 是   | 统一社会信用代码，将弧形环绕在公章下半部分 |
| outputPath | string | 否   | 图片保存路径，不传则只返回 buffer          |

## 特性

- 高清 400x400 PNG 输出
- 红色标准公章样式
- 企业名称弧形环绕
- 统一社会信用代码弧形环绕
- 中心五角星

## 依赖

- [canvas](https://www.npmjs.com/package/canvas) - Node.js Canvas 实现

## License

MIT
