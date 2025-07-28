// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommitGenerator } from './commitGenerator';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "ai-commit-generator" is now active!'
  );

  // Add error handling for extension activation
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // 注册AI生成commit信息的命令
  const generateCommitCommand = vscode.commands.registerCommand(
    'ai-commit-generator.generateCommit',
    async () => {
      // 创建CommitGenerator实例
      const commitGenerator = await new CommitGenerator();

      try {
        vscode.window.showInformationMessage('正在生成commit信息...');

        const commitMessage = await commitGenerator.generateCommitMessage();

        if (commitMessage) {
          // 获取Git扩展并设置commit信息
          const gitExtension = vscode.extensions.getExtension('vscode.git');
          if (gitExtension) {
            const git = gitExtension.exports.getAPI(1);
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            let repository = null;

            if (workspaceFolder) {
              // 查找当前工作区对应的Git仓库
              repository = git.repositories.find(
                (repo: any) =>
                  repo.rootUri.fsPath === workspaceFolder.uri.fsPath
              );

              // 如果没有找到匹配的仓库，使用第一个可用的仓库
              if (!repository && git.repositories.length > 0) {
                repository = git.repositories[0];
              }
            }

            if (repository) {
              repository.inputBox.value = commitMessage;
              vscode.window.showInformationMessage(
                `已生成commit信息: ${commitMessage}`
              );
            } else {
              // 如果无法直接设置到Git输入框，则显示给用户复制
              vscode.window
                .showInformationMessage(
                  `生成的commit信息: ${commitMessage}`,
                  '复制'
                )
                .then((selection) => {
                  if (selection === '复制') {
                    vscode.env.clipboard.writeText(commitMessage);
                    vscode.window.showInformationMessage('已复制到剪贴板');
                  }
                });
            }
          }
        }
      } catch (error) {
        console.error('生成commit信息时出错:', error);
        vscode.window.showErrorMessage('生成commit信息失败');
      }
    }
  );

  context.subscriptions.push(generateCommitCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
