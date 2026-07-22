# Company Seal Generator - 电子公章生成器

基于 Node.js 的电子公章生成工具，使用 Canvas 绘制高清 PNG 图片。

## 安装

```bash
npm install company-seal-generator
```

## 使用

### 作为 Node.js 模块使用

```javascript
const { createSeal } = require('company-seal-generator');

// 仅生成 buffer
const buffer = createSeal('企业名称', '统一社会信用代码');

// 生成并保存到指定路径
const buffer = createSeal('企业名称', '统一社会信用代码', './output/seal.png');
```

### 作为 MCP 服务使用

本项目支持 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)，可以在支持 MCP 的客户端中直接调用。

#### MCP 配置

在 MCP 客户端配置中添加：

**方式一：使用 npx（推荐，无需全局安装）**

```json
{
  "company-seal-generator": {
    "command": "npx",
    "args": ["company-seal-generator"]
  }
}
```

**方式二：使用本地路径**

```json
{
  "company-seal-generator": {
    "command": "node",
    "args": ["/path/to/company-seal-generator/index.js"]
  }
}
```

#### 提供的 MCP 工具

| 工具名 | 描述 | 参数 |
|--------|------|------|
| `generateSeal` | 生成电子公章图片 | `name` - 企业名称<br>`code` - 统一社会信用代码 |

#### MCP 调用示例

```json
{
  "name": "generateSeal",
  "arguments": {
    "name": "某某科技有限公司",
    "code": "91110000123456789X"
  }
}
```

返回结果包含生成的 PNG 图片（Base64 编码）和文字说明。

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
- 支持 MCP 协议，可作为 AI 助手工具使用

## 依赖

- [canvas](https://www.npmjs.com/package/canvas) - Node.js Canvas 实现

## License

MIT
