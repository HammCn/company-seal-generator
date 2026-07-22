#!/usr/bin/env node

const { createSeal } = require('./seal');

const serverInfo = {
  name: 'company-seal-generator',
  version: '0.0.3',
  description: '电子公章生成器 - 基于 Node.js Canvas 绘制高清 PNG 印章图片',
};

const tools = [
  {
    name: 'generateSeal',
    description: '生成电子公章图片',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: '企业名称，将弧形环绕在公章上半部分',
        },
        code: {
          type: 'string',
          description: '统一社会信用代码，将弧形环绕在公章下半部分',
        },
      },
      required: ['name', 'code'],
    },
  },
];

function sendMessage(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

function handleGenerateSeal(params) {
  const { name, code } = params;

  if (!name || !code) {
    return {
      content: [
        {
          type: 'text',
          text: '错误：企业名称和统一社会信用代码都是必填参数',
        },
      ],
      isError: true,
    };
  }

  try {
    const buffer = createSeal(name, code);
    const base64Image = buffer.toString('base64');

    return {
      content: [
        {
          type: 'image',
          data: base64Image,
          mimeType: 'image/png',
        },
        {
          type: 'text',
          text: `已成功生成电子公章图片\n企业名称：${name}\n统一社会信用代码：${code}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `生成公章时发生错误：${error.message}`,
        },
      ],
      isError: true,
    };
  }
}

function handleRequest(request) {
  const { method, params, id } = request;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        serverInfo,
      },
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: { tools },
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;
    let result;

    if (name === 'generateSeal') {
      result = handleGenerateSeal(args);
    } else {
      result = {
        content: [
          {
            type: 'text',
            text: `未知工具：${name}`,
          },
        ],
        isError: true,
      };
    }

    return {
      jsonrpc: '2.0',
      id,
      result,
    };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`,
    },
  };
}

let buffer = '';

process.stdin.on('data', (data) => {
  buffer += data.toString();

  const lines = buffer.split('\n');
  buffer = lines.pop() || '';

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const request = JSON.parse(line);
      const response = handleRequest(request);
      sendMessage(response);
    } catch (error) {
      sendMessage({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32700,
          message: `Parse error: ${error.message}`,
        },
      });
    }
  }
});

process.stdin.on('end', () => {
  process.exit(0);
});
