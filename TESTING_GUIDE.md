# 🧪 AI Commit Generator - 快速测试指南

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 编译项目

```bash
pnpm run compile
```

### 3. 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 监视模式（文件变化时自动运行测试）
pnpm test:watch


```

## 📊 测试结果解读

### ✅ 成功的测试输出示例

```
Extension Test Suite
  ✓ Extension should be present
  ✓ Extension should activate
  ✓ Commands should be registered
  ✓ Configuration should be available

CommitGenerator Test Suite
  Configuration Tests
    ✓ should handle missing API key configuration
    ✓ should handle missing model configuration
    ✓ should handle valid configuration

  Git Extension Tests
    ✓ should handle missing Git extension
    ✓ should handle valid Git extension
    ✓ should handle Git API with repositories
    ✓ should handle empty staged changes

  ... (更多测试用例)
```

### ⚠️ 覆盖率说明

由于 VS Code 扩展测试环境的限制，覆盖率数据可能显示为 "Unknown"。这是正常现象，不影响测试的有效性。

## 🔧 在 VS Code 中调试测试

### 方法 1: 使用调试配置

1. 在测试文件中设置断点
2. 按 `F5` 启动调试
3. 选择 "Extension Tests" 配置
4. 测试将在调试模式下运行

### 方法 2: 使用命令面板

1. 打开命令面板 (`Cmd+Shift+P` / `Ctrl+Shift+P`)
2. 运行 `Tasks: Run Test Task`
3. 选择要运行的测试任务

## 🐛 常见问题解决

### 问题 1: 测试超时

```bash
Error: Timeout of 20000ms exceeded
```

**解决方案**: 检查异步操作是否正确处理，或增加超时时间。

### 问题 2: Mock 不生效

```bash
TypeError: Cannot read property 'get' of undefined
```

**解决方案**: 确保在测试中正确设置了 mock 对象。

### 问题 3: VS Code API 错误

```bash
Error: Cannot find module 'vscode'
```

**解决方案**: 确保在 VS Code 扩展测试环境中运行测试。

## 📈 测试覆盖率评估

虽然自动化覆盖率工具在 VS Code 扩展环境中有限制，但我们通过以下方式评估测试质量：

### 功能覆盖率检查清单

- [ ] 配置管理 - 所有配置场景
- [ ] Git 扩展集成 - 正常和异常情况
- [ ] 错误处理 - 各种错误场景
- [ ] 用户交互 - 消息提示和反馈
- [ ] 核心业务逻辑 - 主要功能流程

### 手动验证步骤

1. **配置测试**: 测试有效和无效的 API 配置
2. **Git 集成测试**: 测试有无 Git 仓库的情况
3. **错误处理测试**: 测试网络错误、API 错误等
4. **边界条件测试**: 测试空暂存区、大文件等

## 🎯 测试最佳实践

### 编写新测试时

1. **描述清晰**: 使用描述性的测试名称
2. **独立性**: 每个测试应该独立运行
3. **Mock 外部依赖**: 使用 Sinon.js 模拟外部服务
4. **测试边界条件**: 包括正常、异常和边界情况

### 示例测试结构

```typescript
suite('Feature Test Suite', () => {
  let mockObject: sinon.SinonStub;

  setup(() => {
    // 设置测试环境
    mockObject = sinon.stub();
  });

  teardown(() => {
    // 清理测试环境
    sinon.restore();
  });

  test('should handle normal case', () => {
    // 测试正常情况
  });

  test('should handle error case', () => {
    // 测试错误情况
  });
});
```

## 📚 更多资源

- [详细测试文档](./TEST.md)
- [VS Code 扩展测试指南](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [Mocha 测试框架文档](https://mochajs.org/)
- [Sinon.js Mock 库文档](https://sinonjs.org/)

## 🤝 贡献测试

如果你想为项目贡献测试用例：

1. Fork 项目
2. 创建测试分支
3. 添加测试用例
4. 确保所有测试通过
5. 提交 Pull Request

记住：好的测试是代码质量的保证！🎉
