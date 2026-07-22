#!/usr/bin/env node

/**
 * MCP Server Entry Point
 * 
 * 基于 Model Context Protocol (MCP) 的电子公章生成服务
 * 通过标准输入输出与 MCP 客户端通信，提供公章生成工具
 */

const { createSeal } = require('./seal');

/**
 * MCP 服务器信息
 */
const serverInfo = {
  name: 'company-seal-generator',
  version: '1.0.2',
  description: '电子公章生成器 - 基于 Node.js Canvas 绘制高清 PNG 印章图片',
};

/**
 * 工具列表定义
 * generateSeal: 生成电子公章图片
 */
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
        step: {
          type: 'number',
          description: '做旧程度，0=不做旧（默认），1=轻微做旧，2=中度做旧，3=重度做旧',
          minimum: 0,
          maximum: 3,
        },
        nameFontSize: {
          type: 'number',
          description: '企业名称字体大小（像素），默认40px',
          minimum: 20,
          maximum: 80,
        },
      },
      required: ['name', 'code'],
    },
  },
];

/**
 * 发送 MCP 消息到标准输出
 * @param {Object} message - 要发送的消息对象
 */
function sendMessage(message) {
  process.stdout.write(JSON.stringify(message) + '\n');
}

/**
 * 处理公章生成请求
 * @param {Object} params - 请求参数
 * @param {string} params.name - 企业名称
 * @param {string} params.code - 统一社会信用代码
 * @param {number} [params.step=0] - 做旧程度
 * @param {number} [params.nameFontSize=40] - 企业名称字体大小
 * @returns {Object} MCP 调用结果
 */
function handleGenerateSeal(params) {
  const { name, code, step = 0, nameFontSize = 40 } = params;

  // 校验必填参数
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
    // 调用 seal.js 生成公章图片
    const buffer = createSeal(name, code, step, nameFontSize);
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

/**
 * 处理 MCP 请求
 * @param {Object} request - MCP JSON-RPC 请求对象
 * @returns {Object} MCP JSON-RPC 响应对象
 */
function handleRequest(request) {
  const { method, params, id } = request;

  // 初始化请求
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

  // 列出可用工具
  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: { tools },
    };
  }

  // 调用工具
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

  // 未知方法
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`,
    },
  };
}

/**
 * 标准输入缓冲区，用于处理分段的 JSON-RPC 消息
 */
let buffer = '';

// 监听标准输入数据
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

// 标准输入结束时退出
process.stdin.on('end', () => {
  process.exit(0);
});
