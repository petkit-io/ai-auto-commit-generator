# AI Commit Generator - 测试文档

## 测试概述

本项目包含了完整的单元测试和集成测试，用于验证 AI Commit Generator 扩展的功能。

## 测试结构

```
src/test/
├── extension.test.ts      # 扩展基础功能测试
├── unit.test.ts          # 所有源码的单元测试
└── ...
```

## 测试类型

### 1. 扩展测试 (extension.test.ts)

- 扩展是否正确加载
- 扩展是否能正常激活
- 命令是否正确注册
- 配置项是否可用

### 2. 单元测试 (unit.test.ts)

- **配置管理**: 验证 API 密钥和模型配置的处理
- **Git 扩展集成**: 验证与 VS Code Git 扩展的集成
- **Diff 内容处理**: 验证 Git diff 内容的获取和处理
- **Prompt 系统**: 验证系统提示词和用户提示词的生成
- **消息生成逻辑**: 验证提交信息的格式和验证
- **错误处理**: 验证各种错误场景的处理
- **扩展集成**: 验证完整的工作流程
- **OpenAI 集成**: 验证 AI 服务的配置和请求格式

## 运行测试

### 安装依赖

```bash
pnpm install
```

### 运行所有测试

```bash
pnpm test
```

### 运行特定测试套件

```bash
# 运行单元测试
pnpm test:unit

# 监视模式运行测试
pnpm test:watch
```

### 在 VS Code 中运行测试

1. 打开命令面板 (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. 运行 `Tasks: Run Test Task`
3. 选择要运行的测试

## 测试覆盖的功能

### ✅ 已测试功能

- [x] 配置管理（API 密钥、模型 ID）
- [x] Git 扩展集成
- [x] 暂存区变更检测
- [x] Diff 内容获取
- [x] 错误处理和用户提示
- [x] 消息格式验证
- [x] 完整工作流程模拟

### 🔄 需要实际 AI 服务的功能

由于测试环境限制，以下功能需要在实际环境中测试：

- OpenAI API 调用
- 实际的提交信息生成
- 网络错误处理

## 测试最佳实践

### 1. Mock 策略

- 使用 Sinon.js 进行函数和对象的模拟
- 模拟 VS Code API 调用
- 模拟 Git 操作和响应

### 2. 测试隔离

- 每个测试用例独立运行
- 使用 `setup()` 和 `teardown()` 确保测试环境清洁
- 避免测试间的相互依赖

### 3. 错误场景覆盖

- 测试各种配置缺失情况
- 测试网络和 API 错误
- 测试 Git 操作失败场景

## 调试测试

### 在 VS Code 中调试测试

1. 在测试文件中设置断点
2. 按 `F5` 启动调试
3. 选择 "Extension Tests" 配置
4. 测试将在调试模式下运行

### 查看测试输出

- 测试结果会显示在 VS Code 的输出面板中
- 使用 `console.log()` 添加调试信息
- 检查 VS Code 开发者工具的控制台

## 持续集成

测试可以集成到 CI/CD 流程中：

```yaml
# .github/workflows/test.yml 示例
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## 故障排除

### 常见问题

1. **测试超时**

   - 增加测试超时时间
   - 检查异步操作是否正确处理

2. **Mock 不生效**

   - 确保 mock 在导入模块之前设置
   - 检查 mock 的调用参数是否正确

3. **VS Code API 错误**
   - 确保在 VS Code 扩展环境中运行测试
   - 检查 API 版本兼容性

### 获取帮助

- 查看 [VS Code 扩展测试文档](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- 检查项目的 GitHub Issues
- 参考 VS Code 扩展开发最佳实践
