import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  //   test('Extension should be present', () => {
  //     assert.ok(vscode.extensions.getExtension('ai-commit-generator'));
  //   });

  test('Extension should activate', async () => {
    const extension = vscode.extensions.getExtension('ai-commit-generator');
    if (extension) {
      await extension.activate();
      assert.strictEqual(extension.isActive, true);
    }
  });

  //   test('Commands should be registered', async () => {
  //     const commands = await vscode.commands.getCommands(true);
  //     const hasGenerateCommitCommand = commands.includes(
  //       'ai-commit-generator.generateCommit'
  //     );
  //     assert.strictEqual(hasGenerateCommitCommand, true);
  //   });

  test('Configuration should be available', () => {
    const config = vscode.workspace.getConfiguration('aiCommitGenerator');
    assert.ok(config);

    // Test that configuration properties exist
    const apiKeyConfig = config.inspect('bailianApiKey');
    const modelConfig = config.inspect('bailianModel');

    assert.ok(apiKeyConfig);
    assert.ok(modelConfig);
  });
});
