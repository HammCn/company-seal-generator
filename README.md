# Company Seal Generator - 电子公章生成器

基于 Node.js 的电子公章生成工具，使用 Canvas 绘制高清 PNG 图片。支持做旧效果，模拟真实公章的磨损痕迹。

## 安装

```bash
npm install company-seal-generator
```

## 使用

### 作为 Node.js 模块使用

```javascript
const { createSeal } = require('company-seal-generator');

// 基础用法（不做旧，默认字体大小）
const buffer = createSeal('企业名称', '统一社会信用代码');

// 指定做旧程度
const buffer = createSeal('企业名称', '统一社会信用代码', 2);

// 指定做旧程度和字体大小
const buffer = createSeal('企业名称', '统一社会信用代码', 2, 60);

// 生成并保存到指定路径
const fs = require('fs');
fs.writeFileSync('./seal.png', buffer);
```

### 作为 MCP 服务使用

本项目支持 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)，可以在支持 MCP 的客户端中直接调用。

#### MCP 配置

在 MCP 客户端配置中添加：

**使用 npx（推荐，无需全局安装）**

```json
{
  "mcpServers":{
    "company-seal-generator": {
      "command": "npx",
      "args": ["company-seal-generator"]
    }
  }
}
```

#### 提供的 MCP 工具

| 工具名         | 描述             | 参数                                                                                                                              |
| -------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `generateSeal` | 生成电子公章图片 | `name` - 企业名称<br>`code` - 统一社会信用代码<br>`step` - 做旧程度（可选，默认0）<br>`nameFontSize` - 字体大小（可选，默认40px） |

#### MCP 调用示例

```json
{
  "name": "generateSeal",
  "arguments": {
    "name": "某某科技有限公司",
    "code": "91110000123456789X",
    "step": 2,
    "nameFontSize": 40
  }
}
```

返回结果包含生成的 PNG 图片（Base64 编码）和文字说明。

## API

### createSeal(name, code, step?, nameFontSize?)

| 参数         | 类型   | 必填 | 说明                                                           |
| ------------ | ------ | ---- | -------------------------------------------------------------- |
| name         | string | 是   | 企业名称，将弧形环绕在公章上半部分                             |
| code         | string | 是   | 统一社会信用代码，将弧形环绕在公章下半部分                     |
| step         | number | 否   | 做旧程度：0=不做旧（默认），1=轻微做旧，2=中度做旧，3=重度做旧 |
| nameFontSize | number | 否   | 企业名称字体大小（像素），默认 40px，范围 20-80                |

## 做旧效果说明

做旧效果通过以下四种技术模拟真实公章的磨损痕迹：

1. **破损遮罩**：在公章表面随机生成半透明遮罩，模拟印章边缘磨损
2. **噪点效果**：添加随机噪点，模拟印章使用过程中的墨点不均
3. **裂痕效果**：在公章区域内生成随机裂痕线条，模拟长期使用产生的裂纹
4. **颜色淡化**：随机淡化部分区域的颜色，模拟墨水褪色效果

## 特性

- 高清 400x400 PNG 输出
- 红色标准公章样式
- 企业名称弧形环绕
- 统一社会信用代码弧形环绕
- 中心五角星
- 支持做旧效果（4 种程度）
- 支持 MCP 协议，可作为 AI 助手工具使用

## 依赖

- [canvas](https://www.npmjs.com/package/canvas) - Node.js Canvas 实现

## License

MIT
