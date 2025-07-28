# AI Commit Generator

一个使用 AI 自动生成 Git 提交信息的 VS Code 扩展。通过分析暂存区的代码变更，自动生成简洁、清晰的中文提交信息。

## Features

- 🤖 **智能提交信息生成**: 基于阿里云百炼 AI 模型分析代码变更
- 🎯 **中文提交信息**: 生成简洁、清晰的中文提交信息
- 🔄 **Git 集成**: 与 VS Code 内置 Git 扩展无缝集成
- ⚡ **一键生成**: 在 Git 面板中一键生成提交信息
- 🛠️ **可配置**: 支持自定义 API 密钥和模型配置

## Requirements

- VS Code 1.94.0 或更高版本
- Git 扩展（VS Code 内置）
- 阿里云百炼 API 密钥和模型访问权限

## Extension Settings

此扩展提供以下配置选项：

- `aiCommitGenerator.bailianApiKey`: 阿里云百炼 API 密钥
- `aiCommitGenerator.bailianModel`: 阿里云百炼模型 ID（默认: qwen-turbo-latest）

### 配置步骤

1. 打开 VS Code 设置 (`Cmd+,` / `Ctrl+,`)
2. 搜索 "AI Commit Generator"
3. 配置你的阿里云百炼 API 密钥和模型 ID

## Usage

1. 在 Git 仓库中进行代码修改
2. 使用 `git add` 将变更添加到暂存区
3. 在 VS Code 的 Git 面板中点击 "AI 生成 Commit 信息" 按钮
4. AI 将自动分析变更并生成提交信息
5. 确认后提交代码

## Development

### 安装依赖

```bash
pnpm install
```

### 编译项目

```bash
pnpm run compile
```

### 运行扩展

按 `F5` 启动扩展开发主机

## Testing

本项目包含完整的单元测试和集成测试。详细的测试文档请参见 [TEST.md](./TEST.md)。

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 监视模式运行测试
pnpm test:watch
```

### 测试覆盖范围

- ✅ 配置管理测试
- ✅ Git 扩展集成测试
- ✅ 错误处理测试
- ✅ 消息生成逻辑测试
- ✅ Prompt 系统测试
- ✅ OpenAI 集成测试
- ✅ 完整工作流程测试

### 在 VS Code 中调试测试

1. 在测试文件中设置断点
2. 按 `F5` 并选择 "Extension Tests" 配置
3. 测试将在调试模式下运行

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
- Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
- Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
